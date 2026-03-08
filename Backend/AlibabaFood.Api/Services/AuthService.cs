using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AlibabaFood.Api.DTOs.Auth;
using AlibabaFood.Api.Models;
using AlibabaFood.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace AlibabaFood.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AlibabaFoodContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AlibabaFoodContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress = null, string? userAgent = null)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
                {
                    await LogLoginAttempt(request.Email, ipAddress, userAgent, false, "Email hoặc mật khẩu không đúng");
                    throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng");
                }

                if (!user.IsActive)
                {
                    await LogLoginAttempt(request.Email, ipAddress, userAgent, false, "Tài khoản đã bị khóa");
                    throw new UnauthorizedAccessException("Tài khoản đã bị khóa");
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);
                var expiresAt = DateTime.UtcNow.AddHours(24);

                // Save session
                var session = new UserSession
                {
                    UserId = user.UserId,
                    SessionToken = token,
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    ExpiresAt = expiresAt
                };

                _context.UserSessions.Add(session);

                // Update last login
                user.LastLogin = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Log successful login
                await LogLoginAttempt(request.Email, ipAddress, userAgent, true);

                return new AuthResponse
                {
                    Token = token,
                    ExpiresAt = expiresAt,
                    User = MapToUserDto(user)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
                throw;
            }
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress = null, string? userAgent = null)
        {
            try
            {
                // Check if email already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email || u.Username == request.Username);

                if (existingUser != null)
                {
                    if (existingUser.Email == request.Email)
                        throw new InvalidOperationException("Email đã được sử dụng");
                    if (existingUser.Username == request.Username)
                        throw new InvalidOperationException("Username đã được sử dụng");
                }

                // Get role
                var role = await _context.Roles
                    .FirstOrDefaultAsync(r => r.RoleName == request.RoleName);

                if (role == null)
                {
                    // Default to customer role if specified role doesn't exist
                    role = await _context.Roles
                        .FirstOrDefaultAsync(r => r.RoleName == "customer");
                    
                    if (role == null)
                        throw new InvalidOperationException("Không tìm thấy vai trò phù hợp");
                }

                // Create new user
                var user = new User
                {
                    Email = request.Email,
                    Username = request.Username,
                    PasswordHash = HashPassword(request.Password),
                    FullName = request.FullName,
                    Phone = request.Phone,
                    RoleId = role.RoleId,
                    IsActive = true,
                    IsVerified = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Generate JWT token
                var token = GenerateJwtToken(user);
                var expiresAt = DateTime.UtcNow.AddHours(24);

                // Save session
                var session = new UserSession
                {
                    UserId = user.UserId,
                    SessionToken = token,
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    ExpiresAt = expiresAt
                };

                _context.UserSessions.Add(session);
                await _context.SaveChangesAsync();

                _logger.LogInformation("New user registered: {Email}", request.Email);

                return new AuthResponse
                {
                    Token = token,
                    ExpiresAt = expiresAt,
                    User = MapToUserDto(user)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
                throw;
            }
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var session = await _context.UserSessions
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.SessionToken == token && s.ExpiresAt > DateTime.UtcNow);

                return session != null && session.User.IsActive;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return false;
            }
        }

        public async Task<User?> GetUserByTokenAsync(string token)
        {
            try
            {
                var session = await _context.UserSessions
                    .Include(s => s.User)
                    .ThenInclude(u => u.Role)
                    .FirstOrDefaultAsync(s => s.SessionToken == token && s.ExpiresAt > DateTime.UtcNow);

                return session?.User;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by token");
                return null;
            }
        }

        public async Task LogoutAsync(string token)
        {
            try
            {
                var session = await _context.UserSessions
                    .FirstOrDefaultAsync(s => s.SessionToken == token);

                if (session != null)
                {
                    _context.UserSessions.Remove(session);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                throw;
            }
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim("username", user.Username),
                new Claim("role", user.Role.RoleName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task LogLoginAttempt(string email, string? ipAddress, string? userAgent, bool success, string? failureReason = null)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                
                if (user != null)
                {
                    var loginHistory = new LoginHistory
                    {
                        UserId = user.UserId,
                        LoginTime = DateTime.UtcNow,
                        IpAddress = ipAddress,
                        UserAgent = userAgent,
                        LoginStatus = success ? "success" : "failed",
                        FailureReason = failureReason
                    };

                    _context.LoginHistories.Add(loginHistory);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging login attempt");
            }
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                FullName = user.FullName,
                Phone = user.Phone,
                AvatarUrl = user.AvatarUrl,
                RoleName = user.Role.RoleName,
                IsVerified = user.IsVerified,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin
            };
        }
    }
}
