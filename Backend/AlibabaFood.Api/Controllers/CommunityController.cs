using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using AlibabaFood.Api.Data;

namespace AlibabaFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommunityController : ControllerBase
    {
        private readonly AlibabaFoodContext _context;
        private readonly ILogger<CommunityController> _logger;

        public CommunityController(AlibabaFoodContext context, ILogger<CommunityController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // =====================================================
        // BẢNG TIN CỘNG ĐỒNG (COMMUNITY POSTS)
        // =====================================================

        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts()
        {
            try
            {
                var postsList = new List<object>();

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT p.post_id, p.user_id, p.title, p.content, p.image_url, p.likes_count, p.comments_count, p.created_at,
                                   u.username, u.full_name, u.avatar_url
                            FROM community_posts p
                            JOIN users u ON p.user_id = u.user_id
                            ORDER BY p.created_at DESC";

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                postsList.Add(new
                                {
                                    PostId = reader.GetInt32(0),
                                    UserId = reader.GetInt32(1),
                                    Title = reader.GetString(2),
                                    Content = reader.GetString(3),
                                    ImageUrl = reader.IsDBNull(4) ? null : reader.GetString(4),
                                    LikesCount = reader.GetInt32(5),
                                    CommentsCount = reader.GetInt32(6),
                                    CreatedAt = reader.GetDateTime(7),
                                    Username = reader.GetString(8),
                                    FullName = reader.GetString(9),
                                    AvatarUrl = reader.IsDBNull(10) ? null : reader.GetString(10),
                                    Comments = new List<object>()
                                });
                            }
                        }
                    }

                    // Fetch comments for all posts
                    foreach (dynamic post in postsList)
                    {
                        using (var cmd = conn.CreateCommand())
                        {
                            cmd.CommandText = @"
                                SELECT c.comment_id, c.post_id, c.user_id, c.content, c.created_at,
                                       u.username, u.full_name, u.avatar_url
                                FROM community_comments c
                                JOIN users u ON c.user_id = u.user_id
                                WHERE c.post_id = @PostId
                                ORDER BY c.created_at ASC";

                            var p1 = cmd.CreateParameter();
                            p1.ParameterName = "@PostId";
                            p1.Value = post.PostId;
                            cmd.Parameters.Add(p1);

                            using (var reader = await cmd.ExecuteReaderAsync())
                            {
                                while (await reader.ReadAsync())
                                {
                                    post.Comments.Add(new
                                    {
                                        CommentId = reader.GetInt32(0),
                                        PostId = reader.GetInt32(1),
                                        UserId = reader.GetInt32(2),
                                        Content = reader.GetString(3),
                                        CreatedAt = reader.GetDateTime(4),
                                        Username = reader.GetString(5),
                                        FullName = reader.GetString(6),
                                        AvatarUrl = reader.IsDBNull(7) ? null : reader.GetString(7)
                                    });
                                }
                            }
                        }
                    }
                }

                return Ok(new { success = true, data = postsList });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching community posts");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống khi tải bài viết: " + ex.Message });
            }
        }

        [HttpPost("posts")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {
            try
            {
                int userId = GetCurrentUserId() ?? dto.UserId ?? 1; // Fallback to 1 if not authenticated

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            INSERT INTO community_posts (user_id, title, content, image_url, likes_count, comments_count, created_at)
                            VALUES (@UserId, @Title, @Content, @ImageUrl, 0, 0, CURRENT_TIMESTAMP)";

                        AddParameter(cmd, "@UserId", userId);
                        AddParameter(cmd, "@Title", dto.Title);
                        AddParameter(cmd, "@Content", dto.Content);
                        AddParameter(cmd, "@ImageUrl", dto.ImageUrl ?? (object)DBNull.Value);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Đăng bài viết thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating community post");
                return StatusCode(500, new { success = false, message = "Lỗi khi đăng bài: " + ex.Message });
            }
        }

        [HttpPost("posts/{id}/like")]
        public async Task<IActionResult> LikePost(int id)
        {
            try
            {
                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            UPDATE community_posts
                            SET likes_count = likes_count + 1
                            WHERE post_id = @PostId";

                        AddParameter(cmd, "@PostId", id);

                        int rows = await cmd.ExecuteNonQueryAsync();
                        if (rows == 0)
                            return NotFound(new { success = false, message = "Không tìm thấy bài viết" });
                    }
                }

                return Ok(new { success = true, message = "Đã thích bài viết" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error liking community post");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("posts/{id}/comment")]
        public async Task<IActionResult> CreateComment(int id, [FromBody] CreateCommentDto dto)
        {
            try
            {
                int userId = GetCurrentUserId() ?? dto.UserId ?? 1;

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            INSERT INTO community_comments (post_id, user_id, content, created_at)
                            VALUES (@PostId, @UserId, @Content, CURRENT_TIMESTAMP);
                            
                            UPDATE community_posts
                            SET comments_count = comments_count + 1
                            WHERE post_id = @PostId;";

                        AddParameter(cmd, "@PostId", id);
                        AddParameter(cmd, "@UserId", userId);
                        AddParameter(cmd, "@Content", dto.Content);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Thêm bình luận thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding comment");
                return StatusCode(500, new { success = false, message = "Lỗi khi thêm bình luận: " + ex.Message });
            }
        }

        // =====================================================
        // ĐÁNH GIÁ SẢN PHẨM & CỬA HÀNG (REVIEWS)
        // =====================================================

        [HttpGet("reviews/product/{itemId}")]
        public async Task<IActionResult> GetProductReviews(int itemId)
        {
            try
            {
                var reviews = new List<object>();

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT r.review_id, r.user_id, r.item_id, r.rating, r.comment, r.created_at,
                                   u.username, u.full_name, u.avatar_url
                            FROM product_reviews r
                            JOIN users u ON r.user_id = u.user_id
                            WHERE r.item_id = @ItemId
                            ORDER BY r.created_at DESC";

                        AddParameter(cmd, "@ItemId", itemId);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                reviews.Add(new
                                {
                                    ReviewId = reader.GetInt32(0),
                                    UserId = reader.GetInt32(1),
                                    ItemId = reader.GetInt32(2),
                                    Rating = reader.GetInt32(3),
                                    Comment = reader.IsDBNull(4) ? null : reader.GetString(4),
                                    CreatedAt = reader.GetDateTime(5),
                                    Username = reader.GetString(6),
                                    FullName = reader.GetString(7),
                                    AvatarUrl = reader.IsDBNull(8) ? null : reader.GetString(8)
                                });
                            }
                        }
                    }
                }

                return Ok(new { success = true, data = reviews });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product reviews");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("reviews/product")]
        public async Task<IActionResult> CreateProductReview([FromBody] CreateProductReviewDto dto)
        {
            try
            {
                int userId = GetCurrentUserId() ?? dto.UserId ?? 1;

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            INSERT INTO product_reviews (user_id, item_id, rating, comment, created_at)
                            VALUES (@UserId, @ItemId, @Rating, @Comment, CURRENT_TIMESTAMP)";

                        AddParameter(cmd, "@UserId", userId);
                        AddParameter(cmd, "@ItemId", dto.ItemId);
                        AddParameter(cmd, "@Rating", dto.Rating);
                        AddParameter(cmd, "@Comment", dto.Comment ?? (object)DBNull.Value);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Đánh giá sản phẩm thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product review");
                return StatusCode(500, new { success = false, message = "Lỗi khi đánh giá sản phẩm: " + ex.Message });
            }
        }

        [HttpGet("reviews/supplier/{supplierId}")]
        public async Task<IActionResult> GetSupplierReviews(int supplierId)
        {
            try
            {
                var reviews = new List<object>();

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT r.review_id, r.user_id, r.supplier_id, r.rating_food, r.rating_accuracy, r.rating_service, r.rating_speed, r.comment, r.created_at,
                                   u.username, u.full_name, u.avatar_url
                            FROM supplier_reviews r
                            JOIN users u ON r.user_id = u.user_id
                            WHERE r.supplier_id = @SupplierId
                            ORDER BY r.created_at DESC";

                        AddParameter(cmd, "@SupplierId", supplierId);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                reviews.Add(new
                                {
                                    ReviewId = reader.GetInt32(0),
                                    UserId = reader.GetInt32(1),
                                    SupplierId = reader.GetInt32(2),
                                    RatingFood = reader.GetInt32(3),
                                    RatingAccuracy = reader.GetInt32(4),
                                    RatingService = reader.GetInt32(5),
                                    RatingSpeed = reader.GetInt32(6),
                                    Comment = reader.IsDBNull(7) ? null : reader.GetString(7),
                                    CreatedAt = reader.GetDateTime(8),
                                    Username = reader.GetString(9),
                                    FullName = reader.GetString(10),
                                    AvatarUrl = reader.IsDBNull(11) ? null : reader.GetString(11)
                                });
                            }
                        }
                    }
                }

                return Ok(new { success = true, data = reviews });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching supplier reviews");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("reviews/supplier")]
        public async Task<IActionResult> CreateSupplierReview([FromBody] CreateSupplierReviewDto dto)
        {
            try
            {
                int userId = GetCurrentUserId() ?? dto.UserId ?? 1;

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            INSERT INTO supplier_reviews (user_id, supplier_id, rating_food, rating_accuracy, rating_service, rating_speed, comment, created_at)
                            VALUES (@UserId, @SupplierId, @RatingFood, @RatingAccuracy, @RatingService, @RatingSpeed, @Comment, CURRENT_TIMESTAMP)";

                        AddParameter(cmd, "@UserId", userId);
                        AddParameter(cmd, "@SupplierId", dto.SupplierId);
                        AddParameter(cmd, "@RatingFood", dto.RatingFood);
                        AddParameter(cmd, "@RatingAccuracy", dto.RatingAccuracy);
                        AddParameter(cmd, "@RatingService", dto.RatingService);
                        AddParameter(cmd, "@RatingSpeed", dto.RatingSpeed);
                        AddParameter(cmd, "@Comment", dto.Comment ?? (object)DBNull.Value);

                        await cmd.ExecuteNonQueryAsync();

                        // Recalculate and update supplier rating_average
                        cmd.CommandText = @"
                            UPDATE suppliers
                            SET rating_average = r.avg_rating,
                                total_reviews = r.count_reviews
                            FROM (
                                SELECT supplier_id, 
                                       CAST(AVG(CAST(rating_food + rating_accuracy + rating_service + rating_speed AS DECIMAL(10,2)) / 4.0) AS DECIMAL(3,2)) as avg_rating,
                                       COUNT(*) as count_reviews
                                FROM supplier_reviews
                                WHERE supplier_id = @SupplierId
                                GROUP BY supplier_id
                            ) r
                            WHERE suppliers.supplier_id = r.supplier_id AND suppliers.supplier_id = @SupplierId";
                        
                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Đánh giá cửa hàng thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating supplier review");
                return StatusCode(500, new { success = false, message = "Lỗi khi đánh giá cửa hàng: " + ex.Message });
            }
        }

        [HttpGet("suppliers")]
        public async Task<IActionResult> GetSuppliers()
        {
            try
            {
                var list = new List<object>();

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT supplier_id, business_name
                            FROM suppliers
                            WHERE is_active = TRUE
                            ORDER BY business_name ASC";

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                list.Add(new
                                {
                                    Id = reader.GetInt32(0),
                                    Name = reader.GetString(1)
                                });
                            }
                        }
                    }
                }

                if (list.Count == 0)
                {
                    list.Add(new { Id = 1, Name = "Quán Cơm Gia Đình A" });
                    list.Add(new { Id = 2, Name = "Bánh Mì Việt B" });
                    list.Add(new { Id = 3, Name = "Cà Phê Góc Phố C" });
                    list.Add(new { Id = 4, Name = "Nhà Hàng Hải Sản D" });
                    list.Add(new { Id = 5, Name = "Tiệm Bánh Ngọt E" });
                    list.Add(new { Id = 6, Name = "Shop Thực Phẩm F" });
                }

                return Ok(new { success = true, data = list });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching suppliers");
                return StatusCode(500, new { success = false, message = "Lỗi khi tải danh sách cửa hàng: " + ex.Message });
            }
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var list = new List<object>();

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT item_id, item_name
                            FROM food_items
                            ORDER BY item_name ASC";

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                list.Add(new
                                {
                                    Id = reader.GetInt32(0),
                                    Name = reader.GetString(1)
                                });
                            }
                        }
                    }
                }

                if (list.Count == 0)
                {
                    list.Add(new { Id = 1, Name = "Cơm gà xối mỡ" });
                    list.Add(new { Id = 2, Name = "Cơm sườn bò chả" });
                    list.Add(new { Id = 3, Name = "Bánh mì thịt nướng" });
                    list.Add(new { Id = 4, Name = "Trà sữa trân châu" });
                    list.Add(new { Id = 5, Name = "Cà phê sữa đá" });
                    list.Add(new { Id = 6, Name = "Cá kho tộ" });
                    list.Add(new { Id = 7, Name = "Tẩm hấp bia" });
                    list.Add(new { Id = 8, Name = "Bánh flan" });
                }

                return Ok(new { success = true, data = list });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching products");
                return StatusCode(500, new { success = false, message = "Lỗi khi tải danh sách sản phẩm: " + ex.Message });
            }
        }

        // =====================================================
        // FEEDBACK & BÁO CÁO VI PHẠM (FEEDBACK & REPORTS)
        // =====================================================

        [HttpGet("feedback")]
        public async Task<IActionResult> GetFeedbacks()
        {
            try
            {
                var feedbacksList = new List<object>();

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT f.feedback_id, f.user_id, f.feedback_type, f.title, f.description, f.created_at,
                                   u.username, u.full_name, u.avatar_url
                            FROM user_feedbacks f
                            JOIN users u ON f.user_id = u.user_id
                            ORDER BY f.created_at DESC";

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                feedbacksList.Add(new
                                {
                                    FeedbackId = reader.GetInt32(0),
                                    UserId = reader.GetInt32(1),
                                    FeedbackType = reader.GetString(2),
                                    Title = reader.GetString(3),
                                    Description = reader.GetString(4),
                                    CreatedAt = reader.GetDateTime(5),
                                    Username = reader.GetString(6),
                                    FullName = reader.GetString(7),
                                    AvatarUrl = reader.IsDBNull(8) ? null : reader.GetString(8)
                                });
                            }
                        }
                    }
                }

                return Ok(new { success = true, data = feedbacksList });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user feedbacks");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống khi tải góp ý: " + ex.Message });
            }
        }

        [HttpPost("feedback")]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackDto dto)
        {
            try
            {
                int userId = GetCurrentUserId() ?? dto.UserId ?? 1;

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            INSERT INTO user_feedbacks (user_id, feedback_type, title, description, created_at)
                            VALUES (@UserId, @FeedbackType, @Title, @Description, CURRENT_TIMESTAMP)";

                        AddParameter(cmd, "@UserId", userId);
                        AddParameter(cmd, "@FeedbackType", dto.FeedbackType);
                        AddParameter(cmd, "@Title", dto.Title);
                        AddParameter(cmd, "@Description", dto.Description);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Gửi góp ý thành công. Cảm ơn sự đóng góp của bạn!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting feedback");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost("report")]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportDto dto)
        {
            try
            {
                int userId = GetCurrentUserId() ?? dto.ReporterId ?? 1;

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            INSERT INTO violation_reports (reporter_id, reported_supplier_id, reported_item_id, report_type, description, status, created_at)
                            VALUES (@ReporterId, @ReportedSupplierId, @ReportedItemId, @ReportType, @Description, 'pending', CURRENT_TIMESTAMP)";

                        AddParameter(cmd, "@ReporterId", userId);
                        AddParameter(cmd, "@ReportedSupplierId", dto.ReportedSupplierId ?? (object)DBNull.Value);
                        AddParameter(cmd, "@ReportedItemId", dto.ReportedItemId ?? (object)DBNull.Value);
                        AddParameter(cmd, "@ReportType", dto.ReportType);
                        AddParameter(cmd, "@Description", dto.Description);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Báo cáo vi phạm thành công. Chúng tôi sẽ tiến hành kiểm tra sớm nhất." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting violation report");
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetCommunityStats([FromQuery] int? userId)
        {
            try
            {
                int targetUserId = userId ?? GetCurrentUserId() ?? 1;

                object? userStats = null;
                var topSavers = new List<object>();
                double systemFoodSaved = 0;
                double systemCarbonSaved = 0;

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    // 1. Fetch User Impact Stats
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT total_orders, total_food_saved_kg, total_discount_saved, carbon_footprint_saved_kg
                            FROM user_impact_stats
                            WHERE user_id = @UserId";
                        
                        AddParameter(cmd, "@UserId", targetUserId);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                userStats = new
                                {
                                    TotalOrders = reader.GetInt32(0),
                                    TotalFoodSavedKg = reader.GetDecimal(1),
                                    TotalDiscountSaved = reader.GetDecimal(2),
                                    CarbonFootprintSavedKg = reader.GetDecimal(3)
                                };
                            }
                        }
                    }

                    // If no stats yet, return default zero values
                    if (userStats == null)
                    {
                        userStats = new
                        {
                            TotalOrders = 0,
                            TotalFoodSavedKg = 0.0m,
                            TotalDiscountSaved = 0.0m,
                            CarbonFootprintSavedKg = 0.0m
                        };
                    }

                    // 2. Fetch Top 3 Savers
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT u.full_name, u.avatar_url, s.total_food_saved_kg
                            FROM user_impact_stats s
                            JOIN users u ON s.user_id = u.user_id
                            ORDER BY s.total_food_saved_kg DESC
                            LIMIT 3";

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            int rank = 1;
                            while (await reader.ReadAsync())
                            {
                                topSavers.Add(new
                                {
                                    Rank = rank++,
                                    FullName = reader.GetString(0),
                                    AvatarUrl = reader.IsDBNull(1) ? null : reader.GetString(1),
                                    TotalFoodSavedKg = reader.GetDecimal(2)
                                });
                            }
                        }
                    }

                    // 3. Fetch System/Community Impact Stats
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                            SELECT SUM(total_food_saved_kg), SUM(carbon_footprint_saved_kg)
                            FROM system_impact_stats";

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync() && !reader.IsDBNull(0))
                            {
                                systemFoodSaved = Convert.ToDouble(reader.GetDecimal(0));
                                systemCarbonSaved = Convert.ToDouble(reader.GetDecimal(1));
                            }
                        }
                    }

                    // If system_impact_stats is empty, aggregate from user_impact_stats
                    if (systemFoodSaved == 0)
                    {
                        using (var cmd = conn.CreateCommand())
                        {
                            cmd.CommandText = @"
                                SELECT SUM(total_food_saved_kg), SUM(carbon_footprint_saved_kg)
                                FROM user_impact_stats";

                            using (var reader = await cmd.ExecuteReaderAsync())
                            {
                                if (await reader.ReadAsync() && !reader.IsDBNull(0))
                                {
                                    systemFoodSaved = Convert.ToDouble(reader.GetDecimal(0));
                                    systemCarbonSaved = Convert.ToDouble(reader.GetDecimal(1));
                                }
                            }
                        }
                    }
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        UserStats = userStats,
                        TopSavers = topSavers,
                        SystemStats = new
                        {
                            TotalFoodSavedKg = systemFoodSaved == 0 ? 85.0 : systemFoodSaved,
                            CarbonFootprintSavedKg = systemCarbonSaved == 0 ? 119.0 : systemCarbonSaved
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching community stats");
                return StatusCode(500, new { success = false, message = "Lỗi tải số liệu thống kê: " + ex.Message });
            }
        }

        // =====================================================
        // HELPERS
        // =====================================================

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null;
        }

        private void AddParameter(IDbCommand cmd, string name, object value)
        {
            var p = cmd.CreateParameter();
            p.ParameterName = name;
            p.Value = value;
            cmd.Parameters.Add(p);
        }
    }

    // DTOs
    public class CreatePostDto
    {
        public int? UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class CreateCommentDto
    {
        public int? UserId { get; set; }
        public string Content { get; set; } = string.Empty;
    }

    public class CreateProductReviewDto
    {
        public int? UserId { get; set; }
        public int ItemId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }

    public class CreateSupplierReviewDto
    {
        public int? UserId { get; set; }
        public int SupplierId { get; set; }
        public int RatingFood { get; set; }
        public int RatingAccuracy { get; set; }
        public int RatingService { get; set; }
        public int RatingSpeed { get; set; }
        public string? Comment { get; set; }
    }

    public class CreateFeedbackDto
    {
        public int? UserId { get; set; }
        public string FeedbackType { get; set; } = "other"; // feature, bug, ui, promo, other
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class CreateReportDto
    {
        public int? ReporterId { get; set; }
        public int? ReportedSupplierId { get; set; }
        public int? ReportedItemId { get; set; }
        public string ReportType { get; set; } = "other"; // incorrect_info, wrong_image, bad_quality, fraud, other
        public string Description { get; set; } = string.Empty;
    }
}
