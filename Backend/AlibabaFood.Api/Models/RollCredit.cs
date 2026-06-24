using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlibabaFood.Api.Models
{
    public class RollCredit
    {
        [Key]
        public int CreditId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int Credits { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
