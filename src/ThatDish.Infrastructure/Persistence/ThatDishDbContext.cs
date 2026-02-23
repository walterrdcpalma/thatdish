using Microsoft.EntityFrameworkCore;
using ThatDish.Domain.Entities;

namespace ThatDish.Infrastructure.Persistence;

public class ThatDishDbContext : DbContext
{
    public ThatDishDbContext(DbContextOptions<ThatDishDbContext> options)
        : base(options)
    {
    }

    public DbSet<Restaurant> Restaurants => Set<Restaurant>();
    public DbSet<Cuisine> Cuisines => Set<Cuisine>();
    public DbSet<Dish> Dishes => Set<Dish>();
    public DbSet<DishFamily> DishFamilies => Set<DishFamily>();
    public DbSet<DishCategory> DishCategories => Set<DishCategory>();
    public DbSet<User> Users => Set<User>();
    public DbSet<SavedDish> SavedDishes => Set<SavedDish>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Rating> Ratings => Set<Rating>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cuisine>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.HasIndex(x => x.Name).IsUnique();
        });

        modelBuilder.Entity<Restaurant>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Cuisine).HasMaxLength(100);
            e.Property(x => x.Address).HasMaxLength(500);
            e.HasOne(x => x.CuisineNavigation)
                .WithMany(c => c.Restaurants)
                .HasForeignKey(x => x.CuisineId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<DishFamily>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.HasIndex(x => x.Name).IsUnique();
        });

        modelBuilder.Entity<DishCategory>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.HasOne(x => x.DishFamily)
                .WithMany(f => f.Categories)
                .HasForeignKey(x => x.DishFamilyId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => new { x.DishFamilyId, x.Name }).IsUnique();
        });

        modelBuilder.Entity<Dish>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.ImageUrl).IsRequired().HasMaxLength(2000);
            e.Property(x => x.LikesCount).HasDefaultValue(0);
            e.Property(x => x.SavesCount).HasDefaultValue(0);
            e.Property(x => x.RatingsCount).HasDefaultValue(0);
            e.Property(x => x.AverageRating).HasDefaultValue(0m);
            e.HasOne(x => x.Restaurant)
                .WithMany(r => r.Dishes)
                .HasForeignKey(x => x.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.DishCategory)
                .WithMany(c => c.Dishes)
                .HasForeignKey(x => x.DishCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.ExternalId).IsRequired().HasMaxLength(256);
            e.HasIndex(x => x.ExternalId).IsUnique();
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.DisplayName).HasMaxLength(200);
        });

        // Junction tables: no navigation collection on Dish; aggregates on Dish (LikesCount, SavesCount, etc.)
        modelBuilder.Entity<SavedDish>(e =>
        {
            e.HasKey(x => x.Id);
            e.ToTable("SavedDishes");
            e.HasOne(x => x.User).WithMany(u => u.SavedDishes).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Dish).WithMany().HasForeignKey(x => x.DishId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.UserId, x.DishId }).IsUnique();
        });

        modelBuilder.Entity<Like>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany(u => u.Likes).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Dish).WithMany().HasForeignKey(x => x.DishId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.UserId, x.DishId }).IsUnique();
        });

        modelBuilder.Entity<Rating>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Score).IsRequired();
            e.HasOne(x => x.User).WithMany(u => u.Ratings).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Dish).WithMany().HasForeignKey(x => x.DishId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.UserId, x.DishId }).IsUnique();
        });
    }
}
