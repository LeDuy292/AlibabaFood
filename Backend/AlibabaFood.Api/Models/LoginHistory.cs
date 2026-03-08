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

        [Column("login_time")]
        public DateTime LoginTime { get; set; } = DateTime.UtcNow;

        [Column("logout_time")]
        public DateTime? LogoutTime { get; set; }

        [MaxLength(45)]
        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [Column("user_agent")]
        public string? UserAgent { get; set; }

        [MaxLength(20)]
        [Column("login_status")]
        public string LoginStatus { get; set; } = "success";

        [MaxLength(255)]
        [Column("failure_reason")]
        public string? FailureReason { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
