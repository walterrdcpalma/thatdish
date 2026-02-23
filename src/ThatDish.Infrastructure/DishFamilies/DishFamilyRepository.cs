using Microsoft.EntityFrameworkCore;
using ThatDish.Application.DishFamilies;
using ThatDish.Domain.Entities;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.DishFamilies;

public class DishFamilyRepository : IDishFamilyRepository
{
    private readonly ThatDishDbContext _db;

    public DishFamilyRepository(ThatDishDbContext db)
    {
        _db = db;
    }

    public async Task<DishFamily?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim();
        if (string.IsNullOrEmpty(normalized)) return null;
        return await _db.DishFamilies
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Name.ToLower() == normalized.ToLowerInvariant(), cancellationToken);
    }

    public async Task<List<DishFamily>> SearchAsync(string search, int limit, CancellationToken cancellationToken = default)
    {
        var term = (search ?? string.Empty).Trim();
        if (string.IsNullOrEmpty(term))
            return await _db.DishFamilies.AsNoTracking().OrderBy(f => f.Name).Take(limit).ToListAsync(cancellationToken);
        var pattern = $"%{term}%";
        return await _db.DishFamilies
            .AsNoTracking()
            .Where(f => EF.Functions.Like(f.Name, pattern))
            .OrderBy(f => f.Name)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }

    public void Add(DishFamily entity)
    {
        _db.DishFamilies.Add(entity);
    }
}
