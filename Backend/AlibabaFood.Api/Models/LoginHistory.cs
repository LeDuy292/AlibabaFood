using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlibabaFood.Api.Models
{
    [Table("login_history")]
    public class LoginHistory
    {
        [Key]
        [Column("history_id")]
        public int HistoryId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("login_time")]
        public DateTime LoginTime { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [MaxLength(500)]
        [Column("user_agent")]
        public string? UserAgent { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("login_status")]
        public string LoginStatus { get; set; } = "success";

        [Column("is_successful")]
        public bool IsSuccessful { get; set; } = true;

        [MaxLength(255)]
        [Column("failure_reason")]
        public string? FailureReason { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
