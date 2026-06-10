using System.Security.Claims;
using AlibabaFood.Api.DTOs.Supplier;
using AlibabaFood.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlibabaFood.Api.Controllers
{
    [ApiController]
    [Route("api/supplier")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;
        private readonly ILogger<SupplierController> _logger;

        public SupplierController(ISupplierService supplierService, ILogger<SupplierController> logger)
        {
            _supplierService = supplierService;
            _logger = logger;
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (int.TryParse(userIdClaim, out var id))
                return id;

            var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (int.TryParse(subClaim, out id))
                return id;

            var jwtSub = User.FindFirstValue("sub");
            if (int.TryParse(jwtSub, out id))
                return id;

            return null;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var profile = await _supplierService.GetSupplierProfileAsync(userId.Value);
            if (profile == null) return NotFound(new { message = "Supplier profile not found" });
            return Ok(profile);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var stats = await _supplierService.GetSupplierStatsAsync(userId.Value);
            if (stats == null) return NotFound(new { message = "Supplier stats not found" });
            return Ok(stats);
        }

        [HttpGet("food-items")]
        public async Task<IActionResult> GetFoodItems()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var items = await _supplierService.GetSupplierFoodItemsAsync(userId.Value);
            return Ok(items);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string? status)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var orders = await _supplierService.GetSupplierOrdersAsync(userId.Value, status);
            return Ok(orders);
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var notifications = await _supplierService.GetSupplierNotificationsAsync(userId.Value);
            return Ok(notifications);
        }

        [HttpGet("reviews")]
        public async Task<IActionResult> GetReviews()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var reviews = await _supplierService.GetSupplierReviewsAsync(userId.Value);
            return Ok(reviews);
        }

        [HttpPost("food-items")]
        public async Task<IActionResult> CreateFoodItem([FromBody] CreateFoodItemRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var created = await _supplierService.CreateFoodItemAsync(userId.Value, request);
                return CreatedAtAction(nameof(GetFoodItems), new { id = created.ItemId }, created);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Create food item failed for supplier {SupplierId}", userId);
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("food-items/{itemId}")]
        public async Task<IActionResult> UpdateFoodItem(int itemId, [FromBody] UpdateFoodItemRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var updated = await _supplierService.UpdateFoodItemAsync(userId.Value, itemId, request);
            if (updated == null) return NotFound(new { message = "Food item not found" });
            return Ok(updated);
        }

        [HttpDelete("food-items/{itemId}")]
        public async Task<IActionResult> DeleteFoodItem(int itemId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            await _supplierService.DeleteFoodItemAsync(userId.Value, itemId);
            return NoContent();
        }

        [HttpPatch("orders/{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var updatedOrder = await _supplierService.UpdateOrderStatusAsync(userId.Value, orderId, request.Status);
            if (updatedOrder == null) return NotFound(new { message = "Order not found" });
            return Ok(updatedOrder);
        }
    }
}
