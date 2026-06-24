using AlibabaFood.Api.DTOs.Supplier;

namespace AlibabaFood.Api.Services
{
    public interface ISupplierService
    {
        Task<SupplierProfileDto?> GetSupplierProfileAsync(int userId);
        Task<SupplierStatsDto?> GetSupplierStatsAsync(int userId);
        Task<List<SupplierFoodItemDto>> GetSupplierFoodItemsAsync(int userId);
        Task<List<SupplierOrderDto>> GetSupplierOrdersAsync(int userId, string? status = null);
        Task<List<SupplierNotificationDto>> GetSupplierNotificationsAsync(int userId);
        Task<List<SupplierReviewDto>> GetSupplierReviewsAsync(int userId);
        Task<SupplierFoodItemDto> CreateFoodItemAsync(int userId, CreateFoodItemRequest request);
        Task<SupplierFoodItemDto?> UpdateFoodItemAsync(int userId, int itemId, UpdateFoodItemRequest request);
        Task DeleteFoodItemAsync(int userId, int itemId);
        Task<SupplierOrderDto?> UpdateOrderStatusAsync(int userId, int orderId, string status);
    }
}
