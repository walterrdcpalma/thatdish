using Microsoft.EntityFrameworkCore;
using ThatDish.Application.Dishes;
using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.Dishes;

public class DishRepository : IDishRepository
{
    private readonly ThatDishDbContext _db;

    public DishRepository(ThatDishDbContext db)
    {
        _db = db;
    }

    public async Task<List<Dish>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Dishes
            .AsNoTracking()
            .Include(d => d.Restaurant)
            .Include(d => d.DishCategory).ThenInclude(c => c!.DishFamily)
            .Include(d => d.SavedDishes).Include(d => d.Likes)
            .OrderBy(d => d.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Dish>> GetPagedAsync(FoodType? foodType, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _db.Dishes
            .AsNoTracking()
            .Include(d => d.Restaurant)
            .Include(d => d.DishCategory).ThenInclude(c => c!.DishFamily)
            .Include(d => d.SavedDishes).Include(d => d.Likes)
            .Where(d => !foodType.HasValue || d.FoodType == foodType.Value);

        return await query
            .OrderBy(d => d.Restaurant.Name)
            .ThenBy(d => d.SortOrder)
            .ThenBy(d => d.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<Dish?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Dishes
            .AsNoTracking()
            .Include(d => d.Restaurant)
            .Include(d => d.DishCategory).ThenInclude(c => c!.DishFamily)
            .Include(d => d.SavedDishes).Include(d => d.Likes)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid restaurantId, string name, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim().ToLowerInvariant();
        return await _db.Dishes
            .AnyAsync(d => d.RestaurantId == restaurantId && d.Name.ToLower() == normalized, cancellationToken);
    }

    public void Add(Dish dish)
    {
        _db.Dishes.Add(dish);
    }
}
