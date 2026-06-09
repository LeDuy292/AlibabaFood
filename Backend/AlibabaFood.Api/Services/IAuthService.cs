using AlibabaFood.Api.DTOs.Auth;
using AlibabaFood.Api.Models;

namespace AlibabaFood.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress = null, string? userAgent = null);
        Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress = null, string? userAgent = null);
        Task<bool> ValidateTokenAsync(string token);
        Task<User?> GetUserByTokenAsync(string token);
        Task LogoutAsync(string token);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
    }
}
