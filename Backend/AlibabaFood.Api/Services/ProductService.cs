using AlibabaFood.Api.Data;
using AlibabaFood.Api.DTOs.Product;
using Microsoft.EntityFrameworkCore;

namespace AlibabaFood.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly AlibabaFoodContext _context;

        public ProductService(AlibabaFoodContext context)
        {
            _context = context;
        }

        public async Task<List<NearbyProductDto>> GetAllProductsAsync(double? latitude = null, double? longitude = null)
        {
            var now = DateTime.UtcNow;

            var foodItems = await _context.FoodItems
                .Include(f => f.Supplier)
                .Include(f => f.Category)
                .Include(f => f.Images)
                .Where(f => f.IsActive && f.Supplier.IsActive)
                .ToListAsync();

            var products = new List<NearbyProductDto>();

            foreach (var item in foodItems)
            {
                var primaryImage = item.Images.FirstOrDefault(i => i.IsPrimary) ?? item.Images.FirstOrDefault();

                double distance = 0;
                if (latitude.HasValue && longitude.HasValue && item.Supplier.Latitude.HasValue && item.Supplier.Longitude.HasValue)
                {
                    distance = CalculateHaversineDistance(latitude.Value, longitude.Value, (double)item.Supplier.Latitude.Value, (double)item.Supplier.Longitude.Value);
                }

                var dto = new NearbyProductDto
                {
                    ItemId = item.ItemId,
                    ItemName = item.ItemName,
                    Description = item.Description,
                    OriginalPrice = item.OriginalPrice,
                    DiscountedPrice = item.DiscountedPrice,
                    DiscountPercentage = item.DiscountPercentage,
                    ImageUrl = primaryImage?.ImageUrl,
                    QuantityAvailable = item.QuantityAvailable,
                    ExpiryTime = item.ExpiryTime,
                    PickupStartTime = item.PickupStartTime,
                    PickupEndTime = item.PickupEndTime,
                    SupplierId = item.SupplierId,
                    SupplierName = item.Supplier.BusinessName,
                    SupplierAddress = item.Supplier.AddressLine1,
                    SupplierLatitude = item.Supplier.Latitude ?? 0,
                    SupplierLongitude = item.Supplier.Longitude ?? 0,
                    SupplierRating = item.Supplier.RatingAverage,
                    SupplierLogoUrl = item.Supplier.LogoUrl,
                    CategoryName = item.Category?.CategoryName ?? "",
                    DistanceKm = Math.Round(distance, 2)
                };

                ApplyAutoDiscount(dto, now);
                products.Add(dto);
            }

            if (latitude.HasValue && longitude.HasValue)
            {
                return products.OrderBy(p => p.DistanceKm).ToList();
            }

            return products.ToList();
        }

        public async Task<List<NearbyProductDto>> GetNearbyProductsAsync(double latitude, double longitude, double radiusKm = 5)
        {
            var now = DateTime.UtcNow;

            // Get all active food items with their suppliers and categories
            var foodItems = await _context.FoodItems
                .Include(f => f.Supplier)
                .Include(f => f.Category)
                .Include(f => f.Images)
                .Where(f => f.IsActive && f.Supplier.IsActive && f.Supplier.Latitude != null && f.Supplier.Longitude != null)
                .ToListAsync();

            var nearbyProducts = new List<NearbyProductDto>();

            foreach (var item in foodItems)
            {
                var supplierLat = (double)item.Supplier.Latitude!;
                var supplierLng = (double)item.Supplier.Longitude!;

                var distance = CalculateHaversineDistance(latitude, longitude, supplierLat, supplierLng);

                if (distance <= radiusKm)
                {
                    // Get primary image or first image
                    var primaryImage = item.Images.FirstOrDefault(i => i.IsPrimary) ?? item.Images.FirstOrDefault();

                    var dto = new NearbyProductDto
                    {
                        ItemId = item.ItemId,
                        ItemName = item.ItemName,
                        Description = item.Description,
                        OriginalPrice = item.OriginalPrice,
                        DiscountedPrice = item.DiscountedPrice,
                        DiscountPercentage = item.DiscountPercentage,
                        ImageUrl = primaryImage?.ImageUrl,
                        QuantityAvailable = item.QuantityAvailable,
                        ExpiryTime = item.ExpiryTime,
                        PickupStartTime = item.PickupStartTime,
                        PickupEndTime = item.PickupEndTime,
                        SupplierId = item.SupplierId,
                        SupplierName = item.Supplier.BusinessName,
                        SupplierAddress = item.Supplier.AddressLine1,
                        SupplierLatitude = item.Supplier.Latitude ?? 0,
                        SupplierLongitude = item.Supplier.Longitude ?? 0,
                        SupplierRating = item.Supplier.RatingAverage,
                        SupplierLogoUrl = item.Supplier.LogoUrl,
                        CategoryName = item.Category?.CategoryName ?? "",
                        DistanceKm = Math.Round(distance, 2)
                    };

                    ApplyAutoDiscount(dto, now);
                    nearbyProducts.Add(dto);
                }
            }

            return nearbyProducts.OrderBy(p => p.DistanceKm).ToList();
        }

        private void ApplyAutoDiscount(NearbyProductDto dto, DateTime now)
        {
            var timeUntilExpiry = dto.ExpiryTime - now;

            // If within 2 hours of expiry and not already heavily discounted
            if (timeUntilExpiry.TotalHours <= 2 && timeUntilExpiry.TotalHours > 0)
            {
                if (dto.DiscountPercentage == null || dto.DiscountPercentage < 50)
                {
                    dto.DiscountPercentage = 50;
                    dto.DiscountedPrice = dto.OriginalPrice * 0.5m;
                }
            }
        }

        /// <summary>
        /// Tính khoảng cách giữa 2 tọa độ GPS bằng công thức Haversine
        /// </summary>
        private static double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; // Bán kính Trái Đất (km)

            var dLat = DegreesToRadians(lat2 - lat1);
            var dLon = DegreesToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c;
        }

        private static double DegreesToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }
    }
}
