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
    public DbSet<Dish> Dishes => Set<Dish>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Rating> Ratings => Set<Rating>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Restaurant>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Address).HasMaxLength(500);
        });

        modelBuilder.Entity<Dish>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.ImageUrl).IsRequired().HasMaxLength(2000);
            e.HasOne(x => x.Restaurant)
                .WithMany(r => r.Dishes)
                .HasForeignKey(x => x.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.ExternalId).IsRequired().HasMaxLength(256);
            e.HasIndex(x => x.ExternalId).IsUnique();
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.DisplayName).HasMaxLength(200);
        });

        modelBuilder.Entity<Like>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany(u => u.Likes).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Dish).WithMany(d => d.Likes).HasForeignKey(x => x.DishId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.UserId, x.DishId }).IsUnique();
        });

        modelBuilder.Entity<Rating>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Score).IsRequired();
            e.HasOne(x => x.User).WithMany(u => u.Ratings).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Dish).WithMany(d => d.Ratings).HasForeignKey(x => x.DishId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.UserId, x.DishId }).IsUnique();
        });
    }
}
