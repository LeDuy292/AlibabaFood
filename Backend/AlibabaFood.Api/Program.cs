using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using AlibabaFood.Api.Data;
using AlibabaFood.Api.Services;
using AlibabaFood.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework
var postgresConnectionString = NormalizePostgresConnectionString(
    builder.Configuration.GetConnectionString("DefaultConnection"));

builder.Services.AddDbContext<AlibabaFoodContext>(options =>
    options.UseNpgsql(postgresConnectionString)
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

// Initialize a brand-new PostgreSQL database from the full seed exactly once.
// Existing databases are left untouched because the SQL dump is not idempotent.
try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AlibabaFoodContext>();
    await InitializePostgreSqlAsync(context, app.Logger);

    if (!await context.Roles.AnyAsync())
    {
        context.Roles.AddRange(
            new Role { RoleName = "customer" },
            new Role { RoleName = "supplier" },
            new Role { RoleName = "admin" }
        );
        await context.SaveChangesAsync();
        app.Logger.LogInformation("Seeded default roles in PostgreSQL.");
    }
}
catch (Exception ex)
{
    app.Logger.LogCritical(ex, "PostgreSQL initialization failed. Check ConnectionStrings__DefaultConnection and the database schema.");
    throw;
}

app.Run();

static string NormalizePostgresConnectionString(string? value)
{
    if (string.IsNullOrWhiteSpace(value))
    {
        throw new InvalidOperationException(
            "ConnectionStrings:DefaultConnection is not configured.");
    }

    if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) ||
        (uri.Scheme != "postgres" && uri.Scheme != "postgresql"))
    {
        return value;
    }

    var credentials = uri.UserInfo.Split(':', 2);
    if (credentials.Length != 2)
    {
        throw new InvalidOperationException(
            "The PostgreSQL URL must contain both a username and password.");
    }

    var connectionString = new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.IsDefaultPort ? 5432 : uri.Port,
        Database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/')),
        Username = Uri.UnescapeDataString(credentials[0]),
        Password = Uri.UnescapeDataString(credentials[1])
    };

    return connectionString.ConnectionString;
}

static async Task InitializePostgreSqlAsync(
    AlibabaFoodContext context,
    ILogger logger)
{
    await context.Database.OpenConnectionAsync();

    try
    {
        await using var tableCountCommand = context.Database.GetDbConnection().CreateCommand();
        tableCountCommand.CommandText = """
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE';
            """;

        var tableCount = Convert.ToInt32(await tableCountCommand.ExecuteScalarAsync());

        if (tableCount == 0)
        {
            var seedPath = Path.Combine(
                AppContext.BaseDirectory,
                "Data",
                "AlibabaFood_Complete_PostgreSQL_Full.sql");

            if (File.Exists(seedPath))
            {
                var sql = await File.ReadAllTextAsync(seedPath);
                await using var transaction = await context.Database.BeginTransactionAsync();

                try
                {
                    await context.Database.ExecuteSqlRawAsync(sql);
                    await transaction.CommitAsync();
                    logger.LogInformation("Initialized the empty PostgreSQL database from {SeedFile}.", Path.GetFileName(seedPath));
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            else
            {
                logger.LogWarning("PostgreSQL seed file was not found; creating the EF Core schema only.");
                await context.Database.EnsureCreatedAsync();
            }
        }

        await EnsurePaymentSchemaAsync(context, logger);
    }
    finally
    {
        await context.Database.CloseConnectionAsync();
    }
}

static async Task EnsurePaymentSchemaAsync(
    AlibabaFoodContext context,
    ILogger logger)
{
    const string sql = """
        ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS order_code BIGINT,
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
            ADD COLUMN IF NOT EXISTS description VARCHAR(255) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS buyer_name VARCHAR(255) NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS buyer_email VARCHAR(255),
            ADD COLUMN IF NOT EXISTS buyer_phone VARCHAR(20),
            ADD COLUMN IF NOT EXISTS buyer_address VARCHAR(500),
            ADD COLUMN IF NOT EXISTS payment_link_id VARCHAR(500),
            ADD COLUMN IF NOT EXISTS checkout_url VARCHAR(1000);

        ALTER TABLE orders
            ALTER COLUMN user_id DROP NOT NULL,
            ALTER COLUMN supplier_id DROP NOT NULL,
            ALTER COLUMN order_status_id DROP NOT NULL,
            ALTER COLUMN order_number DROP NOT NULL,
            ALTER COLUMN final_amount DROP NOT NULL;

        UPDATE orders
        SET order_code = -order_id
        WHERE order_code IS NULL;

        ALTER TABLE orders
            ALTER COLUMN order_code SET NOT NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS ix_orders_order_code
            ON orders (order_code);

        ALTER TABLE order_items
            ADD COLUMN IF NOT EXISTS item_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS price INTEGER;

        UPDATE order_items
        SET item_name = COALESCE(item_name, 'Legacy item'),
            price = COALESCE(price, unit_price::INTEGER, 0);

        ALTER TABLE order_items
            ALTER COLUMN item_name SET NOT NULL,
            ALTER COLUMN price SET NOT NULL,
            ALTER COLUMN unit_price DROP NOT NULL,
            ALTER COLUMN total_price DROP NOT NULL;
        """;

    await using var transaction = await context.Database.BeginTransactionAsync();

    try
    {
        await context.Database.ExecuteSqlRawAsync(sql);
        await transaction.CommitAsync();
        logger.LogInformation("Payment schema is compatible with the current EF Core models.");
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
