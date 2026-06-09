using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlibabaFood.Api.Models
{
    [Table("food_categories")]
    public class FoodCategory
    {
        [Key]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("parent_category_id")]
        public int? ParentCategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("category_name")]
        public string CategoryName { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("category_name_en")]
        public string? CategoryNameEn { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [MaxLength(500)]
        [Column("icon_url")]
        public string? IconUrl { get; set; }

        [Column("display_order")]
        public int DisplayOrder { get; set; } = 0;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<FoodItem> FoodItems { get; set; } = new List<FoodItem>();
    }
}
