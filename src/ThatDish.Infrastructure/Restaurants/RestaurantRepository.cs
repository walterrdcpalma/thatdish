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
}
