using Microsoft.EntityFrameworkCore;
using ThatDish.Application.Dishes;
using ThatDish.Infrastructure.Dishes;
using ThatDish.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddScoped<DishListService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:8081", "http://localhost:19006", "http://127.0.0.1:8081", "http://127.0.0.1:19006")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Health checks (add .AddNpgSql(...) when AspNetCore.HealthChecks.NpgSql is installed for DB check)
builder.Services.AddHealthChecks();

var app = builder.Build();

// In Development: SQLite = create from model; PostgreSQL = run migrations. Then seed mock data.
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ThatDishDbContext>();
        var conn = scope.ServiceProvider.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection");
        var useSqlite = conn?.TrimStart().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase) == true;
        if (useSqlite)
            await db.Database.EnsureCreatedAsync();
        else
            await db.Database.MigrateAsync();
        await SeedData.SeedAsync(db);
    }
}

app.UseHttpsRedirection();
app.UseCors();

app.MapHealthChecks("/health");
app.MapControllers();

app.Run();
