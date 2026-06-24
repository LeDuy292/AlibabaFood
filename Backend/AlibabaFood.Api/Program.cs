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
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .UseSnakeCaseNamingConvention());

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
    var created = context.Database.EnsureCreated();
    
    // Ensure roll_credits table exists (since EnsureCreated won't add tables to an existing DB)
    context.Database.ExecuteSqlRaw(@"
        CREATE TABLE IF NOT EXISTS roll_credits (
            credit_id serial PRIMARY KEY,
            user_id integer NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
            credits integer NOT NULL DEFAULT 0,
            created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Check if database needs seeding
    EnsureCommunityTablesCreated(context);
}

app.Run();

// Local function to ensure community-related tables exist in the database
void EnsureCommunityTablesCreated(AlibabaFoodContext context)
{
    // Create tables if not exist using standard PostgreSQL syntax
    string createTablesSql = @"
        CREATE TABLE IF NOT EXISTS community_posts (
            post_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            image_url VARCHAR(500),
            likes_count INT DEFAULT 0,
            comments_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS community_comments (
            comment_id SERIAL PRIMARY KEY,
            post_id INT NOT NULL,
            user_id INT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE NO ACTION
        );

        CREATE TABLE IF NOT EXISTS product_reviews (
            review_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            item_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
        );

        CREATE TABLE IF NOT EXISTS supplier_reviews (
            review_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            supplier_id INT NOT NULL,
            rating_food INT NOT NULL CHECK (rating_food BETWEEN 1 AND 5),
            rating_accuracy INT NOT NULL CHECK (rating_accuracy BETWEEN 1 AND 5),
            rating_service INT NOT NULL CHECK (rating_service BETWEEN 1 AND 5),
            rating_speed INT NOT NULL CHECK (rating_speed BETWEEN 1 AND 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION
        );

        CREATE TABLE IF NOT EXISTS user_feedbacks (
            feedback_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            feedback_type VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS violation_reports (
            report_id SERIAL PRIMARY KEY,
            reporter_id INT NOT NULL,
            reported_supplier_id INT,
            reported_item_id INT,
            report_type VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (reported_supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION,
            FOREIGN KEY (reported_item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
        );
    ";

    try
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Database is empty. Seeding data from SQL file...");
        
        try
        {
            var sqlFilePath = Path.Combine(AppContext.BaseDirectory, "Data", "AlibabaFood_PostgreSQL.sql");
            if (File.Exists(sqlFilePath))
            {
                var sql = File.ReadAllText(sqlFilePath);
                context.Database.ExecuteSqlRaw(sql);
                logger.LogInformation("Data seeding completed successfully.");
            }
            else
            {
                logger.LogWarning("Seed file not found at {SqlFilePath}", sqlFilePath);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}

app.Run();
