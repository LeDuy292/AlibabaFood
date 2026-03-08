using AlibabaFood.Api.DTOs.Payment;
using AlibabaFood.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AlibabaFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        /// <summary>
        /// Create a PayOS payment link for an order
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreateOrderRequestDto request)
        {
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest(new { message = "Order must contain at least one item." });

            if (string.IsNullOrWhiteSpace(request.BuyerName))
                return BadRequest(new { message = "Buyer name is required." });

            try
            {
                var result = await _paymentService.CreatePaymentLinkAsync(request);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment link.");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get order details by order code
        /// </summary>
        [HttpGet("{orderCode}")]
        public async Task<IActionResult> GetOrder(long orderCode)
        {
            var order = await _paymentService.GetOrderByCodeAsync(orderCode);
            if (order == null)
                return NotFound(new { message = "Order not found." });

            return Ok(new { success = true, data = order });
        }

        /// <summary>
        /// Cancel a pending order
        /// </summary>
        [HttpPost("{orderCode}/cancel")]
        public async Task<IActionResult> CancelOrder(long orderCode)
        {
            var success = await _paymentService.CancelOrderAsync(orderCode);
            if (!success)
                return BadRequest(new { message = "Could not cancel order. It may already be paid or not found." });

            return Ok(new { success = true, message = "Order cancelled successfully." });
        }

        /// <summary>
        /// PayOS webhook endpoint - called by PayOS after payment
        /// </summary>
        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook([FromBody] PayOSWebhookDto webhook)
        {
            _logger.LogInformation("PayOS webhook received: {Code} - {Desc}", webhook.Code, webhook.Desc);

            var handled = await _paymentService.HandleWebhookAsync(webhook);
            if (!handled)
            {
                _logger.LogWarning("Webhook not handled or signature invalid.");
                return BadRequest(new { message = "Invalid webhook." });
            }

            return Ok(new { success = true });
        }
    }
}
