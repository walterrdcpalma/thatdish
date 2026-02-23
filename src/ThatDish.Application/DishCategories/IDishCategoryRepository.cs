using ThatDish.Domain.Entities;

namespace ThatDish.Application.DishCategories;

public interface IDishCategoryRepository
{
    Task<DishCategory?> GetByFamilyAndNameAsync(Guid dishFamilyId, string name, CancellationToken cancellationToken = default);
    Task<List<DishCategory>> SearchByFamilyAsync(Guid dishFamilyId, string? search, int limit, CancellationToken cancellationToken = default);
    void Add(DishCategory entity);
}
