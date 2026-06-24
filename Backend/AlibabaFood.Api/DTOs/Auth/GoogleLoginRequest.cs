using System.ComponentModel.DataAnnotations;

namespace AlibabaFood.Api.DTOs.Auth
{
    public class GoogleLoginRequest
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;
    }
}
