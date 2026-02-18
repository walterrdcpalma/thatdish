using Microsoft.EntityFrameworkCore;
using ThatDish.Application.Restaurants;
using ThatDish.Domain.Entities;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.Restaurants;

public class RestaurantRepository : IRestaurantRepository
{
    private readonly ThatDishDbContext _db;

    public RestaurantRepository(ThatDishDbContext db)
    {
        _db = db;
    }

    public async Task<List<Restaurant>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Restaurants
            .AsNoTracking()
            .OrderBy(r => r.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Restaurant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Restaurants
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<Restaurant?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim().ToLowerInvariant();
        return await _db.Restaurants
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name.ToLower() == normalized, cancellationToken);
    }

    public void Add(Restaurant restaurant)
    {
        _db.Restaurants.Add(restaurant);
    }
}
