using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ThatDish.Api.Exceptions;
using ThatDish.Application.Dishes;
using ThatDish.Application.Restaurants;
using ThatDish.Infrastructure.Dishes;
using ThatDish.Infrastructure.Persistence;
using ThatDish.Infrastructure.Restaurants;

var builder = WebApplication.CreateBuilder(args);

// Bind to Railway/Fly/etc injected PORT in production, fallback to 6000 locally.
var port = Environment.GetEnvironmentVariable("PORT") ?? "6000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var runSeed = builder.Configuration.GetValue<bool>("RUN_SEED");
Console.WriteLine($"[Startup] RUN_SEED resolved: {runSeed}");

// Startup diagnostics for Railway env binding.
var connFromEnvDoubleUnderscore = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
var connFromEnvColon = Environment.GetEnvironmentVariable("ConnectionStrings:DefaultConnection");
Console.WriteLine($"[Startup] Env ConnectionStrings__DefaultConnection set: {!string.IsNullOrWhiteSpace(connFromEnvDoubleUnderscore)}");
Console.WriteLine($"[Startup] Env ConnectionStrings:DefaultConnection set: {!string.IsNullOrWhiteSpace(connFromEnvColon)}");

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// DbContext: SQLite in Development (no PostgreSQL required), PostgreSQL otherwise
builder.Services.AddDbContext<ThatDishDbContext>(options =>
{
    var conn = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionString 'DefaultConnection' not configured.");
    var connParts = conn.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var connHost = connParts.FirstOrDefault(p => p.StartsWith("Host=", StringComparison.OrdinalIgnoreCase)) ?? "Host=<missing>";
    var connUser = connParts.FirstOrDefault(p => p.StartsWith("Username=", StringComparison.OrdinalIgnoreCase)) ?? "Username=<missing>";
    Console.WriteLine($"[Startup] Resolved DefaultConnection -> {connHost}; {connUser}");
    // SQLite when connection string looks like "Data Source=..."
    if (conn.TrimStart().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
        options.UseSqlite(conn);
    else
        options.UseNpgsql(conn);
});

// Application services
builder.Services.AddScoped<IDishRepository, DishRepository>();
builder.Services.AddScoped<IDishService, DishService>();
builder.Services.AddScoped<IRestaurantRepository, RestaurantRepository>();
builder.Services.AddScoped<RestaurantListService>();
builder.Services.AddScoped<IRestaurantClaimService, RestaurantClaimService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Only enable JWT auth when Supabase is properly configured (not placeholders)
var supabaseIssuer = builder.Configuration["Supabase:Issuer"];
var supabaseJwtSecret = builder.Configuration["Supabase:JwtSecret"];
var isSupabaseConfigured = !string.IsNullOrWhiteSpace(supabaseIssuer)
    && !string.IsNullOrWhiteSpace(supabaseJwtSecret)
    && !supabaseJwtSecret.Contains("YOUR_JWT_SECRET", StringComparison.OrdinalIgnoreCase)
    && !supabaseIssuer.Contains("YOUR_PROJECT_REF", StringComparison.OrdinalIgnoreCase);

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

// Health checks (add .AddNpgSql(...) when AspNetCore.HealthChecks.NpgSql is installed for DB check)
builder.Services.AddHealthChecks();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ThatDishDbContext>();
    var conn = scope.ServiceProvider.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection");
    var useSqlite = conn?.TrimStart().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase) == true;
    if (useSqlite)
        await db.Database.EnsureCreatedAsync();
    else
        await db.Database.MigrateAsync();
    await SeedData.SeedAsync(db);
}
else if (runSeed)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ThatDishDbContext>();
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
