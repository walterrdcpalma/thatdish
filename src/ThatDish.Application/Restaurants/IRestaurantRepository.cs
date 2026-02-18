using ThatDish.Domain.Entities;

namespace ThatDish.Application.Restaurants;

public interface IRestaurantRepository
{
    Task<List<Restaurant>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Restaurant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
