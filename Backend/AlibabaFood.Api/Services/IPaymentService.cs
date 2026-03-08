using AlibabaFood.Api.DTOs.Payment;

namespace AlibabaFood.Api.Services
{
    public interface IPaymentService
    {
        Task<CreateOrderResponseDto> CreatePaymentLinkAsync(CreateOrderRequestDto request);
        Task<OrderDetailsDto?> GetOrderByCodeAsync(long orderCode);
        Task<bool> CancelOrderAsync(long orderCode);
        Task<bool> HandleWebhookAsync(PayOSWebhookDto webhook);
    }
}
