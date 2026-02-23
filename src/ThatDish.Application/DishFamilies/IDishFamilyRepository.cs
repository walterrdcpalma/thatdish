using ThatDish.Domain.Entities;

namespace ThatDish.Application.DishFamilies;

public interface IDishFamilyRepository
{
    Task<DishFamily?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<List<DishFamily>> SearchAsync(string search, int limit, CancellationToken cancellationToken = default);
    void Add(DishFamily entity);
}
