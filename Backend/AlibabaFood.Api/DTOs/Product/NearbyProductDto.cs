namespace AlibabaFood.Api.DTOs.Product
{
    public class NearbyProductDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal DiscountedPrice { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public string? ImageUrl { get; set; }
        public int QuantityAvailable { get; set; }
        public DateTime ExpiryTime { get; set; }
        public DateTime? PickupStartTime { get; set; }
        public DateTime? PickupEndTime { get; set; }

        // Supplier info
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public string SupplierAddress { get; set; } = string.Empty;
        public decimal SupplierLatitude { get; set; }
        public decimal SupplierLongitude { get; set; }
        public decimal SupplierRating { get; set; }
        public string? SupplierLogoUrl { get; set; }

        // Category
        public string CategoryName { get; set; } = string.Empty;

        // Distance
        public double DistanceKm { get; set; }
    }
}
