using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlibabaFood.Api.Data;
using AlibabaFood.Api.Models;
using System.Security.Claims;

namespace AlibabaFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RollCreditsController : ControllerBase
    {
        private readonly AlibabaFoodContext _context;

        public RollCreditsController(AlibabaFoodContext context)
        {
            _context = context;
        }

        // GET api/rollcredits
        [HttpGet]
        public async Task<IActionResult> GetUserRollCredits()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var rollCredit = await _context.RollCredits
                    .FirstOrDefaultAsync(rc => rc.UserId == userId);

                if (rollCredit == null)
                {
                    // Create roll credit entry if not exists
                    rollCredit = new RollCredit
                    {
                        UserId = userId,
                        Credits = 0
                    };
                    _context.RollCredits.Add(rollCredit);
                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        userId = rollCredit.UserId,
                        credits = rollCredit.Credits
                    },
                    message = "Roll credits retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving roll credits", error = ex.Message });
            }
        }

        // POST api/rollcredits/use
        [HttpPost("use")]
        public async Task<IActionResult> UseRollCredit()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var rollCredit = await _context.RollCredits
                    .FirstOrDefaultAsync(rc => rc.UserId == userId);

                if (rollCredit == null || rollCredit.Credits <= 0)
                {
                    return BadRequest(new { message = "No roll credits available" });
                }

                rollCredit.Credits -= 1;
                rollCredit.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        userId = rollCredit.UserId,
                        credits = rollCredit.Credits
                    },
                    message = "Roll credit used successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error using roll credit", error = ex.Message });
            }
        }

        // POST api/rollcredits/add
        [HttpPost("add")]
        public async Task<IActionResult> AddRollCredits([FromBody] AddCreditsRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var rollCredit = await _context.RollCredits
                    .FirstOrDefaultAsync(rc => rc.UserId == userId);

                if (rollCredit == null)
                {
                    rollCredit = new RollCredit
                    {
                        UserId = userId,
                        Credits = request.Credits
                    };
                    _context.RollCredits.Add(rollCredit);
                }
                else
                {
                    rollCredit.Credits += request.Credits;
                    rollCredit.UpdatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        userId = rollCredit.UserId,
                        credits = rollCredit.Credits,
                        added = request.Credits
                    },
                    message = $"{request.Credits} roll credits added successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding roll credits", error = ex.Message });
            }
        }

        // Admin endpoint to add credits for any user
        [HttpPost("admin/add")]
        public async Task<IActionResult> AdminAddCredits([FromBody] AdminAddCreditsRequest request)
        {
            try
            {
                // Check if user is admin
                var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
                if (roleClaim != "admin")
                {
                    return Forbid("Only admin can add credits for other users");
                }

                var rollCredit = await _context.RollCredits
                    .FirstOrDefaultAsync(rc => rc.UserId == request.UserId);

                if (rollCredit == null)
                {
                    rollCredit = new RollCredit
                    {
                        UserId = request.UserId,
                        Credits = request.Credits
                    };
                    _context.RollCredits.Add(rollCredit);
                }
                else
                {
                    rollCredit.Credits += request.Credits;
                    rollCredit.UpdatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        userId = rollCredit.UserId,
                        credits = rollCredit.Credits,
                        added = request.Credits
                    },
                    message = $"{request.Credits} roll credits added for user {request.UserId}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding roll credits", error = ex.Message });
            }
        }
    }

    public class AddCreditsRequest
    {
        public int Credits { get; set; }
    }

    public class AdminAddCreditsRequest
    {
        public int UserId { get; set; }
        public int Credits { get; set; }
    }
}
