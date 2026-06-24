using Microsoft.AspNetCore.Mvc;
using AlibabaFood.Api.DTOs.Auth;
using AlibabaFood.Api.Services;

namespace AlibabaFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = Request.Headers["User-Agent"].ToString();

                var result = await _authService.LoginAsync(request, ipAddress, userAgent);

                _logger.LogInformation("User logged in successfully: {Email}", request.Email);

                return Ok(new
                {
                    success = true,
                    message = "Đăng nhập thành công",
                    data = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("Login failed for email: {Email}. Reason: {Reason}", request.Email, ex.Message);
                return Unauthorized(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Đã xảy ra lỗi trong quá trình đăng nhập"
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ",
                        errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }

                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = Request.Headers["User-Agent"].ToString();

                var result = await _authService.RegisterAsync(request, ipAddress, userAgent);

                _logger.LogInformation("New user registered: {Email}", request.Email);

                return Ok(new
                {
                    success = true,
                    message = "Đăng ký thành công",
                    data = result
                });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Registration failed for email: {Email}. Reason: {Reason}", request.Email, ex.Message);
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Đã xảy ra lỗi trong quá trình đăng ký"
                });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Token không được cung cấp"
                    });
                }

                await _authService.LogoutAsync(token);

                _logger.LogInformation("User logged out successfully");

                return Ok(new
                {
                    success = true,
                    message = "Đăng xuất thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Đã xảy ra lỗi trong quá trình đăng xuất"
                });
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Token không được cung cấp"
                    });
                }

                var user = await _authService.GetUserByTokenAsync(token);
                
                if (user == null)
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Token không hợp lệ hoặc đã hết hạn"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        user.UserId,
                        user.Email,
                        user.Username,
                        user.FullName,
                        user.Phone,
                        user.AvatarUrl,
                        RoleName = user.Role.RoleName,
                        user.IsVerified,
                        user.IsActive,
                        user.CreatedAt,
                        user.LastLogin
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Đã xảy ra lỗi khi lấy thông tin người dùng"
                });
            }
        }

        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken([FromBody] string token)
        {
            try
            {
                var isValid = await _authService.ValidateTokenAsync(token);

                return Ok(new
                {
                    success = true,
                    isValid = isValid,
                    message = isValid ? "Token hợp lệ" : "Token không hợp lệ hoặc đã hết hạn"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Đã xảy ra lỗi khi xác thực token"
                });
            }
        }
    }
}
