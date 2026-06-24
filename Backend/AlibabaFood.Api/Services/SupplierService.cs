using AlibabaFood.Api.Data;
using AlibabaFood.Api.DTOs.Supplier;
using AlibabaFood.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AlibabaFood.Api.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly AlibabaFoodContext _context;

        public SupplierService(AlibabaFoodContext context)
        {
            _context = context;
        }

        public async Task<SupplierProfileDto?> GetSupplierProfileAsync(int userId)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId && s.IsActive);

            if (supplier == null) return null;

            return new SupplierProfileDto
            {
                SupplierId = supplier.SupplierId,
                BusinessName = supplier.BusinessName,
                Description = supplier.Description,
                AddressLine1 = supplier.AddressLine1,
                AddressLine2 = supplier.AddressLine2,
                Ward = supplier.Ward,
                District = supplier.District,
                City = supplier.City,
                Province = supplier.Province,
                Phone = supplier.Phone,
                Email = supplier.Email,
                Website = supplier.Website,
                LogoUrl = supplier.LogoUrl,
                CoverImageUrl = supplier.CoverImageUrl,
                RatingAverage = supplier.RatingAverage,
                TotalReviews = supplier.TotalReviews,
                TotalOrders = supplier.TotalOrders,
                TotalFoodSavedKg = supplier.TotalFoodSavedKg,
            };
        }

        public async Task<SupplierStatsDto?> GetSupplierStatsAsync(int userId)
        {
            var supplier = await _context.Suppliers
                .FirstOrDefaultAsync(s => s.UserId == userId && s.IsActive);

            if (supplier == null) return null;

            return new SupplierStatsDto
            {
                TotalOrders = supplier.TotalOrders,
                TotalRevenue = supplier.TotalOrders > 0 ? supplier.TotalOrders * 100000 : 0,
                TotalFoodSavedKg = supplier.TotalFoodSavedKg,
                AverageRating = supplier.RatingAverage,
                TotalReviews = supplier.TotalReviews,
            };
        }

        public async Task<List<SupplierFoodItemDto>> GetSupplierFoodItemsAsync(int userId)
        {
            var supplier = await GetActiveSupplierByUserIdAsync(userId);
            if (supplier == null) return new List<SupplierFoodItemDto>();

            var items = await _context.FoodItems
                .Include(f => f.Category)
                .Include(f => f.Images)
                .Where(f => f.SupplierId == supplier.SupplierId && f.IsActive)
                .ToListAsync();

            return items.Select(item => new SupplierFoodItemDto
            {
                ItemId = item.ItemId,
                ItemName = item.ItemName,
                Description = item.Description,
                QuantityAvailable = item.QuantityAvailable,
                OriginalPrice = item.OriginalPrice,
                DiscountedPrice = item.DiscountedPrice,
                DiscountPercentage = item.DiscountPercentage,
                ExpiryTime = item.ExpiryTime,
                ImageUrl = item.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? item.Images.FirstOrDefault()?.ImageUrl,
                CategoryName = item.Category?.CategoryName ?? "Khác",
                Status = item.IsActive ? "active" : "inactive",
                IsActive = item.IsActive,
            }).ToList();
        }

        public async Task<List<SupplierOrderDto>> GetSupplierOrdersAsync(int userId, string? status = null)
        {
            var supplier = await GetActiveSupplierByUserIdAsync(userId);
            if (supplier == null) return new List<SupplierOrderDto>();

            var ordersQuery = _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.SupplierId == supplier.SupplierId);

            if (!string.IsNullOrEmpty(status))
            {
                ordersQuery = ordersQuery.Where(o => o.Status == status.ToUpper());
            }

            var orders = await ordersQuery
                .OrderByDescending(o => o.CreatedAt)
                .Take(50)
                .ToListAsync();

            return orders.Select(o => new SupplierOrderDto
            {
                OrderId = o.OrderId,
                OrderCode = o.OrderCode,
                TotalAmount = o.TotalAmount,
                FinalAmount = o.TotalAmount,
                Description = o.Description,
                BuyerName = o.BuyerName,
                BuyerEmail = o.BuyerEmail,
                BuyerPhone = o.BuyerPhone,
                BuyerAddress = o.BuyerAddress,
                CreatedAt = o.CreatedAt,
                Status = o.Status,
                StatusName = MapOrderStatus(o.Status),
                ItemName = o.OrderItems.FirstOrDefault()?.ItemName ?? "Nhiều mặt hàng",
                ItemImage = _context.FoodItemImages
                    .Where(img => o.OrderItems.Select(oi => oi.ItemName).Contains(img.ImageUrl ?? ""))
                    .Select(img => img.ImageUrl)
                    .FirstOrDefault(),
                CustomerName = o.BuyerName,
                Notes = null,
            }).ToList();
        }

        public Task<List<SupplierNotificationDto>> GetSupplierNotificationsAsync(int userId)
        {
            return Task.FromResult(new List<SupplierNotificationDto>
            {
                new SupplierNotificationDto { Id = 1, Type = "order", Title = "Đơn hàng mới", Body = "Bạn có đơn mới đang chờ xử lý.", Time = "2 phút trước", Read = false },
                new SupplierNotificationDto { Id = 2, Type = "review", Title = "Đánh giá mới", Body = "Khách hàng đã để lại đánh giá 5 sao.", Time = "10 phút trước", Read = false },
                new SupplierNotificationDto { Id = 3, Type = "warning", Title = "Tồn kho thấp", Body = "Một sản phẩm sắp hết hàng.", Time = "1 giờ trước", Read = true },
            });
        }

        public Task<List<SupplierReviewDto>> GetSupplierReviewsAsync(int userId)
        {
            return Task.FromResult(new List<SupplierReviewDto>
            {
                new SupplierReviewDto { Dish = "Phở Bò Đậm Đà", Shop = "Bếp Xanh", Stars = 5, Text = "Nước dùng đậm đà, thịt bò mềm.", Buyer = "Tuấn Anh." },
                new SupplierReviewDto { Dish = "Cơm Gà", Shop = "Bếp Xanh", Stars = 4, Text = "Đẹp và ngon, sẽ mua lại.", Buyer = "Hoa L." },
            });
        }

        public async Task<SupplierFoodItemDto> CreateFoodItemAsync(int userId, CreateFoodItemRequest request)
        {
            var supplier = await GetActiveSupplierByUserIdAsync(userId);
            if (supplier == null) throw new InvalidOperationException("Supplier not found");

            var item = new FoodItem
            {
                SupplierId = supplier.SupplierId,
                ProductTypeId = 1,
                CategoryId = request.CategoryId ?? 1,
                ItemName = request.ItemName,
                Description = request.Description,
                QuantityAvailable = request.QuantityAvailable,
                OriginalPrice = request.OriginalPrice,
                DiscountedPrice = request.DiscountedPrice,
                DiscountPercentage = request.DiscountPercentage,
                FoodStatusId = 1,
                PreparationTime = DateTime.UtcNow,
                SafeConsumptionTime = DateTime.UtcNow.AddHours(24),
                ExpiryTime = DateTime.UtcNow.AddHours(request.ExpiryHours ?? 24),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            }; 

            _context.FoodItems.Add(item);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrWhiteSpace(request.ImageUrl))
            {
                var image = new FoodItemImage
                {
                    ItemId = item.ItemId,
                    ImageUrl = request.ImageUrl,
                    IsPrimary = true,
                    DisplayOrder = 0,
                    CreatedAt = DateTime.UtcNow,
                };
                _context.FoodItemImages.Add(image);
                await _context.SaveChangesAsync();
            }

            var items = await GetSupplierFoodItemsAsync(userId);
            return items.First(dto => dto.ItemId == item.ItemId);
        }

        public async Task<SupplierFoodItemDto?> UpdateFoodItemAsync(int userId, int itemId, UpdateFoodItemRequest request)
        {
            var supplier = await GetActiveSupplierByUserIdAsync(userId);
            if (supplier == null) return null;

            var item = await _context.FoodItems.FirstOrDefaultAsync(f => f.ItemId == itemId && f.SupplierId == supplier.SupplierId);
            if (item == null) return null;

            if (request.QuantityAvailable.HasValue) item.QuantityAvailable = request.QuantityAvailable.Value;
            if (request.DiscountedPrice.HasValue) item.DiscountedPrice = request.DiscountedPrice.Value;
            if (request.OriginalPrice.HasValue) item.OriginalPrice = request.OriginalPrice.Value;
            if (!string.IsNullOrEmpty(request.ItemName)) item.ItemName = request.ItemName;
            if (!string.IsNullOrEmpty(request.Description)) item.Description = request.Description;
            if (request.IsActive.HasValue) item.IsActive = request.IsActive.Value;

            item.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new SupplierFoodItemDto
            {
                ItemId = item.ItemId,
                ItemName = item.ItemName,
                Description = item.Description,
                QuantityAvailable = item.QuantityAvailable,
                OriginalPrice = item.OriginalPrice,
                DiscountedPrice = item.DiscountedPrice,
                DiscountPercentage = item.DiscountPercentage,
                ExpiryTime = item.ExpiryTime,
                ImageUrl = item.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? item.Images.FirstOrDefault()?.ImageUrl,
                CategoryName = item.Category?.CategoryName ?? "Khác",
                Status = item.IsActive ? "active" : "inactive",
                IsActive = item.IsActive,
            };
        }

        public async Task DeleteFoodItemAsync(int userId, int itemId)
        {
            var supplier = await GetActiveSupplierByUserIdAsync(userId);
            if (supplier == null) return;

            var item = await _context.FoodItems.FirstOrDefaultAsync(f => f.ItemId == itemId && f.SupplierId == supplier.SupplierId);
            if (item == null) return;

            _context.FoodItems.Remove(item);
            await _context.SaveChangesAsync();
        }

        public async Task<SupplierOrderDto?> UpdateOrderStatusAsync(int userId, int orderId, string status)
        {
            var supplier = await GetActiveSupplierByUserIdAsync(userId);
            if (supplier == null) return null;

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId && o.SupplierId == supplier.SupplierId);
            if (order == null) return null;

            order.Status = status.ToUpper();
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new SupplierOrderDto
            {
                OrderId = order.OrderId,
                OrderCode = order.OrderCode,
                TotalAmount = order.TotalAmount,
                FinalAmount = order.TotalAmount,
                Description = order.Description,
                BuyerName = order.BuyerName,
                BuyerEmail = order.BuyerEmail,
                BuyerPhone = order.BuyerPhone,
                BuyerAddress = order.BuyerAddress,
                CreatedAt = order.CreatedAt,
                Status = order.Status,
                StatusName = MapOrderStatus(order.Status),
                ItemName = _context.OrderItems.Where(oi => oi.OrderId == order.OrderId).Select(oi => oi.ItemName).FirstOrDefault() ?? "Nhiều mặt hàng",
                ItemImage = _context.FoodItemImages.Select(img => img.ImageUrl).FirstOrDefault(),
                CustomerName = order.BuyerName,
                Notes = null,
            };
        }

        private async Task<Supplier?> GetActiveSupplierByUserIdAsync(int userId)
        {
            return await _context.Suppliers.FirstOrDefaultAsync(s => s.UserId == userId && s.IsActive);
        }

        private static string MapOrderStatus(string status)
        {
            return status switch
            {
                "PENDING" => "Chờ duyệt",
                "PAID" => "Đã thanh toán",
                "CONFIRMED" => "Đã xác nhận",
                "PREPARING" => "Đang chuẩn bị",
                "READY" => "Đã xong",
                "DELIVERED" => "Đã giao",
                "CANCELLED" => "Đã hủy",
                _ => status,
            };
        }
    }
}
