using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlibabaFood.Api.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("order_id")]
        public int OrderId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("order_code")]
        public long OrderCode { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("status")]
        public string Status { get; set; } = "PENDING"; // PENDING, PAID, CANCELLED

        [Column("total_amount")]
        public int TotalAmount { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("buyer_name")]
        public string BuyerName { get; set; } = string.Empty;

        [MaxLength(255)]
        [Column("buyer_email")]
        public string? BuyerEmail { get; set; }

        [MaxLength(20)]
        [Column("buyer_phone")]
        public string? BuyerPhone { get; set; }

        [MaxLength(500)]
        [Column("buyer_address")]
        public string? BuyerAddress { get; set; }

        [MaxLength(500)]
        [Column("payment_link_id")]
        public string? PaymentLinkId { get; set; }

        [MaxLength(1000)]
        [Column("checkout_url")]
        public string? CheckoutUrl { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
