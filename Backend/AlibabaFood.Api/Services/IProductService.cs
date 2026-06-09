using AlibabaFood.Api.DTOs.Product;

namespace AlibabaFood.Api.Services
{
    public interface IProductService
    {
        Task<List<NearbyProductDto>> GetNearbyProductsAsync(double latitude, double longitude, double radiusKm = 5);
        Task<List<NearbyProductDto>> GetAllProductsAsync(double? latitude = null, double? longitude = null);
    }
}
