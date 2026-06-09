using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlibabaFood.Api.Models
{
    [Table("food_items")]
    public class FoodItem
    {
        [Key]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Required]
        [Column("supplier_id")]
        public int SupplierId { get; set; }

        [Required]
        [Column("product_type_id")]
        public int ProductTypeId { get; set; }

        [Required]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("item_name")]
        public string ItemName { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("is_surprise_bag")]
        public bool IsSurpriseBag { get; set; } = false;

        [Column("quantity_available")]
        public int QuantityAvailable { get; set; } = 0;

        [Column("original_price")]
        public decimal OriginalPrice { get; set; }

        [Column("discounted_price")]
        public decimal DiscountedPrice { get; set; }

        [Column("discount_percentage")]
        public decimal? DiscountPercentage { get; set; }

        [Required]
        [Column("food_status_id")]
        public int FoodStatusId { get; set; }

        [Column("preparation_time")]
        public DateTime PreparationTime { get; set; }

        [Column("safe_consumption_time")]
        public DateTime SafeConsumptionTime { get; set; }

        [Column("expiry_time")]
        public DateTime ExpiryTime { get; set; }

        [Column("pickup_start_time")]
        public DateTime? PickupStartTime { get; set; }

        [Column("pickup_end_time")]
        public DateTime? PickupEndTime { get; set; }

        [Column("is_pre_order")]
        public bool IsPreOrder { get; set; } = false;

        [Column("weight_kg")]
        public decimal? WeightKg { get; set; }

        [Column("calories")]
        public int? Calories { get; set; }

        [Column("allergens")]
        public string? Allergens { get; set; }

        [Column("ingredients")]
        public string? Ingredients { get; set; }

        [Column("storage_instructions")]
        public string? StorageInstructions { get; set; }

        [Column("reheating_instructions")]
        public string? ReheatingInstructions { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("is_approved")]
        public bool IsApproved { get; set; } = false;

        [Column("approved_by")]
        public int? ApprovedBy { get; set; }

        [Column("approved_at")]
        public DateTime? ApprovedAt { get; set; }

        [Column("total_sold")]
        public int TotalSold { get; set; } = 0;

        [Column("view_count")]
        public int ViewCount { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("SupplierId")]
        public virtual Supplier Supplier { get; set; } = null!;

        [ForeignKey("CategoryId")]
        public virtual FoodCategory Category { get; set; } = null!;

        public virtual ICollection<FoodItemImage> Images { get; set; } = new List<FoodItemImage>();
    }
}
