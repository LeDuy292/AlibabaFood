using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using AlibabaFood.Api.Data;
using AlibabaFood.Api.DTOs.Payment;
using AlibabaFood.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AlibabaFood.Api.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly HttpClient _httpClient;
        private readonly AlibabaFoodContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PaymentService> _logger;

        private const string PayOSBaseUrl = "https://api-merchant.payos.vn";

        public PaymentService(
            IHttpClientFactory httpClientFactory,
            AlibabaFoodContext context,
            IConfiguration configuration,
            ILogger<PaymentService> logger)
        {
            _httpClient = httpClientFactory.CreateClient("PayOS");
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<CreateOrderResponseDto> CreatePaymentLinkAsync(CreateOrderRequestDto request)
        {
            var clientId = _configuration["PayOS:ClientId"]!;
            var apiKey = _configuration["PayOS:ApiKey"]!;
            var checksumKey = _configuration["PayOS:ChecksumKey"]!;
            var returnUrl = _configuration["PayOS:ReturnUrl"]!;
            var cancelUrl = _configuration["PayOS:CancelUrl"]!;

            // Generate unique order code (timestamp-based to stay within int32 range for PayOS)
            var orderCode = DateTimeOffset.UtcNow.ToUnixTimeSeconds() % 1000000000L + new Random().Next(1, 999);

            var totalAmount = request.Items.Sum(i => i.Price * i.Quantity);
            var description = $"DH{orderCode}";

            // Build signature data (alphabetical order of keys)
            var signatureData = $"amount={totalAmount}&cancelUrl={cancelUrl}&description={description}&orderCode={orderCode}&returnUrl={returnUrl}";
            var signature = ComputeHmacSha256(signatureData, checksumKey);

            // Build request payload
            var payloadItems = request.Items.Select(i => new
            {
                name = i.Name,
                quantity = i.Quantity,
                price = i.Price
            }).ToList();

            var payload = new
            {
                orderCode,
                amount = totalAmount,
                description,
                buyerName = request.BuyerName,
                buyerEmail = request.BuyerEmail,
                buyerPhone = request.BuyerPhone,
                buyerAddress = request.BuyerAddress,
                items = payloadItems,
                cancelUrl,
                returnUrl,
                signature
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{PayOSBaseUrl}/v2/payment-requests");
            requestMessage.Headers.Add("x-client-id", clientId);
            requestMessage.Headers.Add("x-api-key", apiKey);
            requestMessage.Content = content;

            var response = await _httpClient.SendAsync(requestMessage);
            var responseBody = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("PayOS CreatePaymentLink response: {Response}", responseBody);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("PayOS API error: {StatusCode} - {Body}", response.StatusCode, responseBody);
                throw new Exception($"PayOS API error: {response.StatusCode}");
            }

            var payosResponse = JsonSerializer.Deserialize<PayOSApiResponse>(responseBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (payosResponse?.Code != "00" || payosResponse.Data == null)
            {
                throw new Exception($"PayOS returned error: {payosResponse?.Desc ?? "Unknown error"}");
            }

            // Save order to database
            var order = new Order
            {
                OrderCode = orderCode,
                Status = "PENDING",
                TotalAmount = totalAmount,
                Description = description,
                BuyerName = request.BuyerName,
                BuyerEmail = request.BuyerEmail,
                BuyerPhone = request.BuyerPhone,
                BuyerAddress = request.BuyerAddress,
                PaymentLinkId = payosResponse.Data.PaymentLinkId,
                CheckoutUrl = payosResponse.Data.CheckoutUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                OrderItems = request.Items.Select(i => new OrderItem
                {
                    ItemName = i.Name,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return new CreateOrderResponseDto
            {
                OrderId = order.OrderId,
                OrderCode = orderCode,
                CheckoutUrl = payosResponse.Data.CheckoutUrl,
                PaymentLinkId = payosResponse.Data.PaymentLinkId,
                Status = "PENDING",
                Amount = totalAmount
            };
        }

        public async Task<OrderDetailsDto?> GetOrderByCodeAsync(long orderCode)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderCode == orderCode);

            if (order == null) return null;

            return new OrderDetailsDto
            {
                OrderId = order.OrderId,
                OrderCode = order.OrderCode,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                Description = order.Description,
                BuyerName = order.BuyerName,
                BuyerEmail = order.BuyerEmail,
                BuyerPhone = order.BuyerPhone,
                BuyerAddress = order.BuyerAddress,
                CheckoutUrl = order.CheckoutUrl,
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(i => new OrderItemDetailsDto
                {
                    ItemName = i.ItemName,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };
        }

        public async Task<bool> CancelOrderAsync(long orderCode)
        {
            var clientId = _configuration["PayOS:ClientId"]!;
            var apiKey = _configuration["PayOS:ApiKey"]!;

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{PayOSBaseUrl}/v2/payment-requests/{orderCode}/cancel");
            requestMessage.Headers.Add("x-client-id", clientId);
            requestMessage.Headers.Add("x-api-key", apiKey);
            requestMessage.Content = new StringContent("{}", Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(requestMessage);
            if (response.IsSuccessStatusCode)
            {
                var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderCode == orderCode);
                if (order != null)
                {
                    order.Status = "CANCELLED";
                    order.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
                return true;
            }

            return false;
        }

        public async Task<bool> HandleWebhookAsync(PayOSWebhookDto webhook)
        {
            // Verify webhook signature
            if (webhook.Data == null) return false;

            var checksumKey = _configuration["PayOS:ChecksumKey"]!;
            var isValid = VerifyWebhookSignature(webhook, checksumKey);
            if (!isValid)
            {
                _logger.LogWarning("Invalid PayOS webhook signature received.");
                return false;
            }

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderCode == webhook.Data.OrderCode);
            if (order == null)
            {
                _logger.LogWarning("Webhook received for unknown orderCode: {OrderCode}", webhook.Data.OrderCode);
                return false;
            }

            // Update order status based on webhook code
            order.Status = webhook.Data.Code == "00" ? "PAID" : "CANCELLED";
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order {OrderCode} status updated to {Status}", order.OrderCode, order.Status);
            return true;
        }

        private static string ComputeHmacSha256(string data, string key)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var dataBytes = Encoding.UTF8.GetBytes(data);
            using var hmac = new HMACSHA256(keyBytes);
            var hash = hmac.ComputeHash(dataBytes);
            return Convert.ToHexString(hash).ToLower();
        }

        private static bool VerifyWebhookSignature(PayOSWebhookDto webhook, string checksumKey)
        {
            if (webhook.Data == null) return false;

            // Build sorted signature string from webhook data
            var signatureData = $"accountNumber={webhook.Data.AccountNumber}" +
                                $"&amount={webhook.Data.Amount}" +
                                $"&description={webhook.Data.Description}" +
                                $"&orderCode={webhook.Data.OrderCode}" +
                                $"&paymentLinkId={webhook.Data.PaymentLinkId}" +
                                $"&reference={webhook.Data.Reference}" +
                                $"&transactionDateTime={webhook.Data.TransactionDateTime}";

            var computedSignature = ComputeHmacSha256(signatureData, checksumKey);
            return string.Equals(computedSignature, webhook.Signature, StringComparison.OrdinalIgnoreCase);
        }
    }

    // Internal models for deserializing PayOS API response
    internal class PayOSApiResponse
    {
        [JsonPropertyName("code")]
        public string Code { get; set; } = string.Empty;

        [JsonPropertyName("desc")]
        public string Desc { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public PayOSPaymentLinkData? Data { get; set; }
    }

    internal class PayOSPaymentLinkData
    {
        [JsonPropertyName("bin")]
        public string Bin { get; set; } = string.Empty;

        [JsonPropertyName("accountNumber")]
        public string AccountNumber { get; set; } = string.Empty;

        [JsonPropertyName("accountName")]
        public string AccountName { get; set; } = string.Empty;

        [JsonPropertyName("amount")]
        public int Amount { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("orderCode")]
        public long OrderCode { get; set; }

        [JsonPropertyName("currency")]
        public string Currency { get; set; } = string.Empty;

        [JsonPropertyName("paymentLinkId")]
        public string PaymentLinkId { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("checkoutUrl")]
        public string CheckoutUrl { get; set; } = string.Empty;

        [JsonPropertyName("qrCode")]
        public string QrCode { get; set; } = string.Empty;
    }
}
