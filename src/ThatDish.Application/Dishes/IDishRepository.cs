using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;

namespace ThatDish.Application.Dishes;

public interface IDishRepository
{
    Task<List<Dish>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<Dish>> GetPagedAsync(FoodType? foodType, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<Dish?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
