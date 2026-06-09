using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlibabaFood.Api.Models
{
    [Table("suppliers")]
    public class Supplier
    {
        [Key]
        [Column("supplier_id")]
        public int SupplierId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("business_name")]
        public string BusinessName { get; set; } = string.Empty;

        [Required]
        [Column("business_type_id")]
        public int BusinessTypeId { get; set; }

        [MaxLength(100)]
        [Column("business_registration_number")]
        public string? BusinessRegistrationNumber { get; set; }

        [MaxLength(50)]
        [Column("tax_code")]
        public string? TaxCode { get; set; }

        [MaxLength(500)]
        [Column("logo_url")]
        public string? LogoUrl { get; set; }

        [MaxLength(500)]
        [Column("cover_image_url")]
        public string? CoverImageUrl { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [MaxLength(500)]
        [Column("address_line1")]
        public string AddressLine1 { get; set; } = string.Empty;

        [MaxLength(500)]
        [Column("address_line2")]
        public string? AddressLine2 { get; set; }

        [MaxLength(100)]
        [Column("ward")]
        public string? Ward { get; set; }

        [MaxLength(100)]
        [Column("district")]
        public string? District { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("city")]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("province")]
        public string Province { get; set; } = string.Empty;

        [Column("latitude")]
        public decimal? Latitude { get; set; }

        [Column("longitude")]
        public decimal? Longitude { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(255)]
        [Column("email")]
        public string? Email { get; set; }

        [MaxLength(255)]
        [Column("website")]
        public string? Website { get; set; }

        [Column("opening_time")]
        public TimeSpan? OpeningTime { get; set; }

        [Column("closing_time")]
        public TimeSpan? ClosingTime { get; set; }

        [Column("is_verified")]
        public bool IsVerified { get; set; } = false;

        [Column("verification_date")]
        public DateTime? VerificationDate { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("rating_average")]
        public decimal RatingAverage { get; set; } = 0;

        [Column("total_reviews")]
        public int TotalReviews { get; set; } = 0;

        [Column("total_orders")]
        public int TotalOrders { get; set; } = 0;

        [Column("total_food_saved_kg")]
        public decimal TotalFoodSavedKg { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        public virtual ICollection<FoodItem> FoodItems { get; set; } = new List<FoodItem>();
    }
}
