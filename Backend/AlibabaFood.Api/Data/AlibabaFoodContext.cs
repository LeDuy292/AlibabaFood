using Microsoft.EntityFrameworkCore;
using AlibabaFood.Api.Models;

namespace AlibabaFood.Api.Data
{
    public class AlibabaFoodContext : DbContext
    {
        public AlibabaFoodContext(DbContextOptions<AlibabaFoodContext> options) : base(options)
        {
        }

        // Users
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }

        // Orders
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Role entity
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RoleId);
                entity.HasIndex(e => e.RoleName).IsUnique();
                entity.Property(e => e.RoleName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.AvatarUrl).HasMaxLength(500);
                entity.Property(e => e.IsVerified).HasDefaultValue(false);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                // Configure foreign key relationship
                entity.HasOne(u => u.Role)
                      .WithMany(r => r.Users)
                      .HasForeignKey(u => u.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure UserSession entity
            modelBuilder.Entity<UserSession>(entity =>
            {
                entity.HasKey(e => e.SessionId);
                entity.HasIndex(e => e.SessionToken).IsUnique();
                entity.Property(e => e.SessionToken).IsRequired().HasMaxLength(2048);
                entity.Property(e => e.IpAddress).HasMaxLength(45);
                entity.Property(e => e.ExpiresAt).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");

                // Configure foreign key relationship
                entity.HasOne(s => s.User)
                      .WithMany(u => u.UserSessions)
                      .HasForeignKey(s => s.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Index for token validation
                entity.HasIndex(e => new { e.SessionToken, e.ExpiresAt });
            });

            // Configure LoginHistory entity
            modelBuilder.Entity<LoginHistory>(entity =>
            {
                entity.HasKey(e => e.HistoryId);
                entity.Property(e => e.IpAddress).HasMaxLength(45);
                entity.Property(e => e.LoginStatus).IsRequired().HasMaxLength(20).HasDefaultValue("success");
                entity.Property(e => e.FailureReason).HasMaxLength(255);
                entity.Property(e => e.LoginTime).HasDefaultValueSql("GETDATE()");

                // Configure foreign key relationship
                entity.HasOne(l => l.User)
                      .WithMany(u => u.LoginHistories)
                      .HasForeignKey(l => l.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Index for user login history
                entity.HasIndex(e => new { e.UserId, e.LoginTime });
            });

            // Configure Order entity
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.OrderId);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50).HasDefaultValue("PENDING");
                entity.Property(e => e.Description).IsRequired().HasMaxLength(255);
                entity.Property(e => e.BuyerName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.BuyerEmail).HasMaxLength(255);
                entity.Property(e => e.BuyerPhone).HasMaxLength(20);
                entity.Property(e => e.BuyerAddress).HasMaxLength(500);
                entity.Property(e => e.PaymentLinkId).HasMaxLength(500);
                entity.Property(e => e.CheckoutUrl).HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                entity.HasIndex(e => e.OrderCode).IsUnique();

                entity.HasOne(o => o.User)
                      .WithMany()
                      .HasForeignKey(o => o.UserId)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure OrderItem entity
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.OrderItemId);
                entity.Property(e => e.ItemName).IsRequired().HasMaxLength(255);

                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed default roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "customer", Description = "Khách hàng mua thực phẩm", CreatedAt = DateTime.UtcNow },
                new Role { RoleId = 2, RoleName = "supplier", Description = "Nhà cung cấp/cửa hàng", CreatedAt = DateTime.UtcNow },
                new Role { RoleId = 3, RoleName = "admin", Description = "Quản trị viên hệ thống", CreatedAt = DateTime.UtcNow },
                new Role { RoleId = 4, RoleName = "moderator", Description = "Kiểm duyệt viên", CreatedAt = DateTime.UtcNow }
            );
        }
    }
}
