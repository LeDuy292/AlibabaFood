using System.ComponentModel.DataAnnotations;

namespace AlibabaFood.Api.DTOs.Supplier
{
    public class SupplierProfileDto
    {
        public int SupplierId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string AddressLine1 { get; set; } = string.Empty;
        public string? AddressLine2 { get; set; }
        public string? Ward { get; set; }
        public string? District { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? LogoUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public decimal RatingAverage { get; set; }
        public int TotalReviews { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalFoodSavedKg { get; set; }
    }

    public class SupplierStatsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalFoodSavedKg { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }

    public class SupplierFoodItemDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int QuantityAvailable { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal DiscountedPrice { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime ExpiryTime { get; set; }
        public string? ImageUrl { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class SupplierOrderDto
    {
        public int OrderId { get; set; }
        public long OrderCode { get; set; }
        public int TotalAmount { get; set; }
        public int FinalAmount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string BuyerName { get; set; } = string.Empty;
        public string? BuyerEmail { get; set; }
        public string? BuyerPhone { get; set; }
        public string? BuyerAddress { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string StatusName { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string? ItemImage { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class SupplierNotificationDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public bool Read { get; set; }
    }

    public class SupplierReviewDto
    {
        public string Dish { get; set; } = string.Empty;
        public string Shop { get; set; } = string.Empty;
        public int Stars { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Buyer { get; set; } = string.Empty;
    }

    public class CreateFoodItemRequest
    {
        [Required]
        public string ItemName { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public int QuantityAvailable { get; set; }

        [Required]
        public decimal OriginalPrice { get; set; }

        [Required]
        public decimal DiscountedPrice { get; set; }

        public decimal? DiscountPercentage { get; set; }
        public int? CategoryId { get; set; }
        public int? ExpiryHours { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateFoodItemRequest
    {
        public int? QuantityAvailable { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string? ItemName { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
