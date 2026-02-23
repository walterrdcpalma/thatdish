using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ThatDish.Api.Exceptions;
using ThatDish.Api.Services;
using ThatDish.Application.Cuisines;
using ThatDish.Application.DishCategories;
using ThatDish.Application.DishFamilies;
using ThatDish.Application.Dishes;
using ThatDish.Application.Restaurants;
using ThatDish.Infrastructure.Cuisines;
using ThatDish.Infrastructure.DishCategories;
using ThatDish.Infrastructure.DishFamilies;
using ThatDish.Infrastructure.Dishes;
using ThatDish.Infrastructure.Persistence;
using ThatDish.Infrastructure.Restaurants;

var builder = WebApplication.CreateBuilder(args);

// Listen on all interfaces so LAN devices (e.g. Expo on phone) can reach the API. PORT env for production.
var port = Environment.GetEnvironmentVariable("PORT") ?? "6000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// DbContext: SQLite in Development (no PostgreSQL required), PostgreSQL otherwise
builder.Services.AddDbContext<ThatDishDbContext>(options =>
{
    var conn = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionString 'DefaultConnection' not configured.");
    // SQLite when connection string looks like "Data Source=..."
    if (conn.TrimStart().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
        options.UseSqlite(conn);
    else
        options.UseNpgsql(conn);
});

// Application services
builder.Services.AddScoped<IDishRepository, DishRepository>();
builder.Services.AddScoped<IDishFamilyRepository, DishFamilyRepository>();
builder.Services.AddScoped<IDishCategoryRepository, DishCategoryRepository>();
builder.Services.AddScoped<ICuisineRepository, CuisineRepository>();
builder.Services.AddScoped<IDishService, DishService>();
builder.Services.AddScoped<IRestaurantRepository, RestaurantRepository>();
builder.Services.AddScoped<RestaurantListService>();
builder.Services.AddScoped<IRestaurantClaimService, RestaurantClaimService>();
builder.Services.AddHttpClient(nameof(SupabaseStorageService));
builder.Services.AddScoped<ISupabaseStorageService, SupabaseStorageService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Only enable JWT auth when Supabase is properly configured (not placeholders).
// Issuer can be set explicitly or derived from ProjectUrl (Supabase standard: ProjectUrl + "/auth/v1").
var supabaseProjectUrl = builder.Configuration["Supabase:ProjectUrl"]?.TrimEnd('/');
var supabaseIssuer = builder.Configuration["Supabase:Issuer"]?.Trim();
if (string.IsNullOrWhiteSpace(supabaseIssuer) && !string.IsNullOrWhiteSpace(supabaseProjectUrl))
    supabaseIssuer = supabaseProjectUrl + "/auth/v1";
var supabaseJwtSecret = builder.Configuration["Supabase:JwtSecret"];
var isSupabaseConfigured = !string.IsNullOrWhiteSpace(supabaseIssuer)
    && !string.IsNullOrWhiteSpace(supabaseJwtSecret);

if (isSupabaseConfigured)
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = supabaseIssuer,
                ValidAudience = "authenticated",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(supabaseJwtSecret!)),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                NameClaimType = "sub",
            };
        });
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddHealthChecks();

var app = builder.Build();

// In Development, ensure DB is migrated and seeded (idempotent). Aligns with Supabase/Postgres script.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ThatDishDbContext>();
    await db.Database.MigrateAsync();
    await SeedData.SeedAsync(db);
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
app.UseCors();
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();
app.MapHealthChecks("/health");
app.MapControllers();

app.Run();
