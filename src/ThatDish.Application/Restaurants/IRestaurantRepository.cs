using ThatDish.Domain.Entities;

namespace ThatDish.Application.Restaurants;

public interface IRestaurantRepository
{
    Task<List<Restaurant>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Restaurant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    /// <summary>Get restaurant by id with tracking for updates (e.g. claim state changes).</summary>
    Task<Restaurant?> GetByIdTrackedAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Restaurant?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    /// <summary>Restaurants claimed by this user (Pending, Verified, or Rejected). Used for My Restaurants.</summary>
    Task<List<Restaurant>> GetByClaimedByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<RestaurantSearchResult>> SearchByNameAsync(string term, int limit, CancellationToken cancellationToken = default);
    void Add(Restaurant restaurant);
}
