using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AlibabaFood.Api.Data;
using AlibabaFood.Api.Services;
using AlibabaFood.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework
builder.Services.AddDbContext<AlibabaFoodContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = key,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddHttpClient<IAIService, AIService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddHttpClient("PayOS");
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ISupplierService, SupplierService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new { message = "AlibabaFood API is running", status = "Healthy", documentation = "/openapi/v1.json" }));

// Seed database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AlibabaFoodContext>();
    // context.Database.EnsureCreated(); // Comment out since database already exists
    EnsureCommunityTablesCreated(context);
}

app.Run();

// Local function to ensure community-related tables exist in the database
void EnsureCommunityTablesCreated(AlibabaFoodContext context)
{
    string checkSql = @"
        -- Alter existing columns to NVARCHAR for Vietnamese character support
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'full_name' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE users ALTER COLUMN full_name NVARCHAR(255) NOT NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'business_name' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN business_name NVARCHAR(255) NOT NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'description' AND DATA_TYPE IN ('varchar', 'text'))
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN description NVARCHAR(MAX) NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'address_line1' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN address_line1 NVARCHAR(500) NOT NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'address_line2' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN address_line2 NVARCHAR(500) NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'ward' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN ward NVARCHAR(100) NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'district' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN district NVARCHAR(100) NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'city' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN city NVARCHAR(100) NOT NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'suppliers' AND COLUMN_NAME = 'province' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE suppliers ALTER COLUMN province NVARCHAR(100) NOT NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user_addresses' AND COLUMN_NAME = 'address_line1' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE user_addresses ALTER COLUMN address_line1 NVARCHAR(500) NOT NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user_addresses' AND COLUMN_NAME = 'address_line2' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE user_addresses ALTER COLUMN address_line2 NVARCHAR(500) NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user_addresses' AND COLUMN_NAME = 'ward' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE user_addresses ALTER COLUMN ward NVARCHAR(100) NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user_addresses' AND COLUMN_NAME = 'district' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE user_addresses ALTER COLUMN district NVARCHAR(100) NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user_addresses' AND COLUMN_NAME = 'city' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE user_addresses ALTER COLUMN city NVARCHAR(100) NOT NULL;
        END

        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user_addresses' AND COLUMN_NAME = 'province' AND DATA_TYPE = 'varchar')
        BEGIN
            ALTER TABLE user_addresses ALTER COLUMN province NVARCHAR(100) NOT NULL;
        END

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='community_posts' AND xtype='U')
        BEGIN
            CREATE TABLE community_posts (
                post_id INT PRIMARY KEY IDENTITY(1,1),
                user_id INT NOT NULL,
                title NVARCHAR(255) NOT NULL,
                content NVARCHAR(MAX) NOT NULL,
                image_url VARCHAR(500),
                likes_count INT DEFAULT 0,
                comments_count INT DEFAULT 0,
                created_at DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        END

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='community_comments' AND xtype='U')
        BEGIN
            CREATE TABLE community_comments (
                comment_id INT PRIMARY KEY IDENTITY(1,1),
                post_id INT NOT NULL,
                user_id INT NOT NULL,
                content NVARCHAR(MAX) NOT NULL,
                created_at DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE NO ACTION
            );
        END

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='product_reviews' AND xtype='U')
        BEGIN
            CREATE TABLE product_reviews (
                review_id INT PRIMARY KEY IDENTITY(1,1),
                user_id INT NOT NULL,
                item_id INT NOT NULL,
                rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment NVARCHAR(MAX),
                created_at DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
            );
        END

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='supplier_reviews' AND xtype='U')
        BEGIN
            CREATE TABLE supplier_reviews (
                review_id INT PRIMARY KEY IDENTITY(1,1),
                user_id INT NOT NULL,
                supplier_id INT NOT NULL,
                rating_food INT NOT NULL CHECK (rating_food BETWEEN 1 AND 5),
                rating_accuracy INT NOT NULL CHECK (rating_accuracy BETWEEN 1 AND 5),
                rating_service INT NOT NULL CHECK (rating_service BETWEEN 1 AND 5),
                rating_speed INT NOT NULL CHECK (rating_speed BETWEEN 1 AND 5),
                comment NVARCHAR(MAX),
                created_at DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION
            );
        END

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_feedbacks' AND xtype='U')
        BEGIN
            CREATE TABLE user_feedbacks (
                feedback_id INT PRIMARY KEY IDENTITY(1,1),
                user_id INT NOT NULL,
                feedback_type VARCHAR(50) NOT NULL,
                title NVARCHAR(255) NOT NULL,
                description NVARCHAR(MAX) NOT NULL,
                created_at DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        END

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='violation_reports' AND xtype='U')
        BEGIN
            CREATE TABLE violation_reports (
                report_id INT PRIMARY KEY IDENTITY(1,1),
                reporter_id INT NOT NULL,
                reported_supplier_id INT,
                reported_item_id INT,
                report_type VARCHAR(50) NOT NULL,
                description NVARCHAR(MAX) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (reported_supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION,
                FOREIGN KEY (reported_item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
            );
        END
    ";
    try
    {
        context.Database.ExecuteSqlRaw(checkSql);

        // Seed sample community posts if empty
        string seedSql = @"
            IF NOT EXISTS (SELECT * FROM community_posts)
            BEGIN
                DECLARE @user_a INT, @user_b INT, @user_c INT;
                SELECT TOP 1 @user_a = user_id FROM users;
                SELECT TOP 1 @user_b = user_id FROM users WHERE user_id <> @user_a;
                SELECT TOP 1 @user_c = user_id FROM users WHERE user_id NOT IN (@user_a, @user_b);

                IF @user_a IS NOT NULL
                BEGIN
                    INSERT INTO community_posts (user_id, title, content, image_url, likes_count, comments_count, created_at)
                    VALUES 
                    (@user_a, N'Túi mù siêu hời hôm nay!', N'Hôm nay ghé qua Tiệm Bánh Ngọt E lấy túi Surprise Bag cuối ngày. Chỉ với 35k nhận được tận 3 chiếc bánh sừng bò và 1 bánh su kem khổng lồ. Vừa ngon lại vừa chung tay bảo vệ môi trường, giảm lãng phí thức ăn!', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 24, 2, DATEADD(hour, -5, GETDATE())),
                    (@user_b, N'Bữa trưa cơm gà ngon rẻ', N'Hộp cơm gà xối mỡ nóng hổi của Quán Cơm Gia Đình A. Thịt gà giòn rụm, cơm dẻo thơm. Canh dưa chua đi kèm cũng siêu ngon. Highly recommend mọi người đặt món ủng hộ quán nhé!', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', 18, 1, DATEADD(hour, -2, GETDATE())),
                    (@user_c, N'Tiết kiệm & Tiêu dùng xanh', N'Mình đã tiết kiệm được hơn 500k từ khi sử dụng Alibaba Food. Cảm giác vừa mua được đồ ăn giá tốt vừa giúp hạn chế lượng thực phẩm thừa bị thải bỏ thực sự rất ý nghĩa. Hãy cùng nhau lan tỏa lối sống xanh này!', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', 42, 3, DATEADD(day, -1, GETDATE()));

                    DECLARE @post_1 INT, @post_2 INT;
                    SELECT TOP 1 @post_1 = post_id FROM community_posts WHERE title LIKE N'%Túi mù%';
                    SELECT TOP 1 @post_2 = post_id FROM community_posts WHERE title LIKE N'%Cơm gà%';

                    IF @post_1 IS NOT NULL
                    BEGIN
                        INSERT INTO community_comments (post_id, user_id, content) VALUES
                        (@post_1, @user_b, N'Ui bánh tiệm này ngon lắm nè, bữa mình cũng mua được 1 túi y chang.'),
                        (@post_1, @user_c, N'Thích quá, để chiều nay mình cũng canh đặt thử xem.');
                    END

                    IF @post_2 IS NOT NULL
                    BEGIN
                        INSERT INTO community_comments (post_id, user_id, content) VALUES
                        (@post_2, @user_a, N'Gà giòn rụm luôn đúng không bạn, nước chấm sốt cũng cuốn lắm.');
                    END

                    -- Seed user impact stats
                    IF NOT EXISTS (SELECT * FROM user_impact_stats WHERE user_id = @user_a)
                        INSERT INTO user_impact_stats (user_id, total_orders, total_food_saved_kg, total_discount_saved, carbon_footprint_saved_kg)
                        VALUES (@user_a, 15, 28.5, 285000, 39.9);
                    ELSE
                        UPDATE user_impact_stats SET total_orders = 15, total_food_saved_kg = 28.5, total_discount_saved = 285000, carbon_footprint_saved_kg = 39.9 WHERE user_id = @user_a AND total_food_saved_kg = 0;

                    IF NOT EXISTS (SELECT * FROM user_impact_stats WHERE user_id = @user_b)
                        INSERT INTO user_impact_stats (user_id, total_orders, total_food_saved_kg, total_discount_saved, carbon_footprint_saved_kg)
                        VALUES (@user_b, 11, 21.0, 210000, 29.4);
                    ELSE
                        UPDATE user_impact_stats SET total_orders = 11, total_food_saved_kg = 21.0, total_discount_saved = 210000, carbon_footprint_saved_kg = 29.4 WHERE user_id = @user_b AND total_food_saved_kg = 0;

                    IF NOT EXISTS (SELECT * FROM user_impact_stats WHERE user_id = @user_c)
                        INSERT INTO user_impact_stats (user_id, total_orders, total_food_saved_kg, total_discount_saved, carbon_footprint_saved_kg)
                        VALUES (@user_c, 8, 18.2, 182000, 25.5);
                    ELSE
                        UPDATE user_impact_stats SET total_orders = 8, total_food_saved_kg = 18.2, total_discount_saved = 182000, carbon_footprint_saved_kg = 25.5 WHERE user_id = @user_c AND total_food_saved_kg = 0;

                    -- Seed user feedbacks
                    IF NOT EXISTS (SELECT * FROM user_feedbacks)
                    BEGIN
                        INSERT INTO user_feedbacks (user_id, feedback_type, title, description, created_at)
                        VALUES
                        (@user_a, 'feature', N'Tích hợp thanh toán MoMo', N'Mình thấy hiện tại web chỉ hỗ trợ PayOS, nếu thêm cả MoMo và VNPay thì sẽ tiện lợi hơn nhiều cho người dùng di động.', DATEADD(day, -2, GETDATE())),
                        (@user_b, 'ui', N'Giao diện tối ở trang chủ', N'Giao diện trang tư vấn AI rất đẹp, mình hy vọng trang chủ cũng có chế độ Dark Mode đồng bộ như vậy.', DATEADD(day, -1, GETDATE()));
                    END
                END
            END
        ";
        context.Database.ExecuteSqlRaw(seedSql);

        // Repair existing database data encoding issues
        string repairUnicodeSql = @"
            UPDATE users SET full_name = N'Nguyễn Văn A' WHERE username = 'supplier1';
            UPDATE users SET full_name = N'Trần Thị B' WHERE username = 'supplier2';
            UPDATE users SET full_name = N'Lê Văn C' WHERE username = 'supplier3';
            UPDATE users SET full_name = N'Phạm Thị D' WHERE username = 'supplier4';
            UPDATE users SET full_name = N'Hoàng Văn E' WHERE username = 'supplier5';
            UPDATE users SET full_name = N'Nguyễn Thị F' WHERE username = 'supplier6';

            UPDATE s
            SET s.business_name = N'Quán Cơm Gia Đình A'
            FROM suppliers s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.username = 'supplier1';

            UPDATE s
            SET s.business_name = N'Bánh Mì Việt B'
            FROM suppliers s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.username = 'supplier2';

            UPDATE s
            SET s.business_name = N'Cà Phê Góc Phố C'
            FROM suppliers s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.username = 'supplier3';

            UPDATE s
            SET s.business_name = N'Nhà Hàng Hải Sản D'
            FROM suppliers s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.username = 'supplier4';

            UPDATE s
            SET s.business_name = N'Tiệm Bánh Ngọt E'
            FROM suppliers s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.username = 'supplier5';

            UPDATE s
            SET s.business_name = N'Shop Thực Phẩm F'
            FROM suppliers s
            JOIN users u ON s.user_id = u.user_id
            WHERE u.username = 'supplier6';
        ";
        context.Database.ExecuteSqlRaw(repairUnicodeSql);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error ensuring community tables exist and are seeded: " + ex.Message);
    }
}
