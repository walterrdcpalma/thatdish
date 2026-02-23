using Microsoft.EntityFrameworkCore;
using ThatDish.Application.Cuisines;
using ThatDish.Domain.Entities;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.Cuisines;

public class CuisineRepository : ICuisineRepository
{
    private readonly ThatDishDbContext _db;

    public CuisineRepository(ThatDishDbContext db)
    {
        _db = db;
    }

    public async Task<Cuisine?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim();
        if (string.IsNullOrEmpty(normalized)) return null;
        return await _db.Cuisines
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Name.ToLower() == normalized.ToLowerInvariant(), cancellationToken);
    }

    public async Task<List<Cuisine>> SearchAsync(string search, int limit, CancellationToken cancellationToken = default)
    {
        var term = (search ?? string.Empty).Trim();
        if (string.IsNullOrEmpty(term))
            return await _db.Cuisines.AsNoTracking().OrderBy(c => c.Name).Take(limit).ToListAsync(cancellationToken);
        var pattern = $"%{term}%";
        return await _db.Cuisines
            .AsNoTracking()
            .Where(c => EF.Functions.Like(c.Name, pattern))
            .OrderBy(c => c.Name)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }

    public void Add(Cuisine entity)
    {
        _db.Cuisines.Add(entity);
    }
}
