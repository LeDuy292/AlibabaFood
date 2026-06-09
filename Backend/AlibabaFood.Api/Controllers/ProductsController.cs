using AlibabaFood.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AlibabaFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Lấy tất cả sản phẩm
        /// </summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllProducts([FromQuery] double? lat = null, [FromQuery] double? lng = null)
        {
            try
            {
                var products = await _productService.GetAllProductsAsync(lat, lng);

                return Ok(new
                {
                    success = true,
                    data = products,
                    total = products.Count,
                    message = products.Count > 0
                        ? $"Tìm thấy {products.Count} sản phẩm"
                        : "Không tìm thấy sản phẩm nào"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy danh sách sản phẩm gần vị trí người dùng
        /// </summary>
        /// <param name="lat">Latitude của người dùng</param>
        /// <param name="lng">Longitude của người dùng</param>
        /// <param name="radiusKm">Bán kính tìm kiếm (km), mặc định 5km</param>
        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyProducts(
            [FromQuery] double lat,
            [FromQuery] double lng,
            [FromQuery] double radiusKm = 5)
        {
            try
            {
                if (lat < -90 || lat > 90 || lng < -180 || lng > 180)
                {
                    return BadRequest(new { message = "Tọa độ không hợp lệ" });
                }

                var products = await _productService.GetNearbyProductsAsync(lat, lng, radiusKm);

                return Ok(new
                {
                    success = true,
                    data = products,
                    total = products.Count,
                    message = products.Count > 0
                        ? $"Tìm thấy {products.Count} sản phẩm trong bán kính {radiusKm}km"
                        : $"Không tìm thấy sản phẩm nào trong bán kính {radiusKm}km"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi", error = ex.Message });
            }
        }
    }
}
