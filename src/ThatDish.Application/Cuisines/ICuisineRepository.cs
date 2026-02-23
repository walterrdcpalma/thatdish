using ThatDish.Domain.Entities;

namespace ThatDish.Application.Cuisines;

public interface ICuisineRepository
{
    Task<Cuisine?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<List<Cuisine>> SearchAsync(string search, int limit, CancellationToken cancellationToken = default);
    void Add(Cuisine entity);
}
