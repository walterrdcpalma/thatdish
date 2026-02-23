using Microsoft.EntityFrameworkCore;
using ThatDish.Application.DishCategories;
using ThatDish.Domain.Entities;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.DishCategories;

public class DishCategoryRepository : IDishCategoryRepository
{
    private readonly ThatDishDbContext _db;

    public DishCategoryRepository(ThatDishDbContext db)
    {
        _db = db;
    }

    public async Task<DishCategory?> GetByFamilyAndNameAsync(Guid dishFamilyId, string name, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim();
        if (string.IsNullOrEmpty(normalized)) return null;
        return await _db.DishCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(c =>
                c.DishFamilyId == dishFamilyId &&
                c.Name.ToLower() == normalized.ToLowerInvariant(), cancellationToken);
    }

    public async Task<List<DishCategory>> SearchByFamilyAsync(Guid dishFamilyId, string? search, int limit, CancellationToken cancellationToken = default)
    {
        var query = _db.DishCategories.AsNoTracking().Where(c => c.DishFamilyId == dishFamilyId);
        var term = (search ?? string.Empty).Trim();
        if (!string.IsNullOrEmpty(term))
        {
            var pattern = $"%{term}%";
            query = query.Where(c => EF.Functions.Like(c.Name, pattern));
        }
        return await query.OrderBy(c => c.Name).Take(limit).ToListAsync(cancellationToken);
    }

    public void Add(DishCategory entity)
    {
        _db.DishCategories.Add(entity);
    }
}
