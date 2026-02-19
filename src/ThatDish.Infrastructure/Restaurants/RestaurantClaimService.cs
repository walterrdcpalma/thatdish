using ThatDish.Application.Restaurants;
using ThatDish.Domain.Enums;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.Restaurants;

public class RestaurantClaimService : IRestaurantClaimService
{
    private readonly IRestaurantRepository _repo;
    private readonly ThatDishDbContext _db;

    public RestaurantClaimService(IRestaurantRepository repo, ThatDishDbContext db)
    {
        _repo = repo;
        _db = db;
    }

    public async Task<RestaurantDto> SubmitClaimAsync(Guid restaurantId, Guid userId, CancellationToken cancellationToken = default)
    {
        var restaurant = await _repo.GetByIdTrackedAsync(restaurantId, cancellationToken);
        if (restaurant == null)
            throw new KeyNotFoundException("Restaurant not found.");

        if (restaurant.ClaimStatus != ClaimStatus.None && restaurant.ClaimStatus != ClaimStatus.Rejected)
            throw new InvalidOperationException(
                "Claim can only be submitted when status is None or Rejected. Current status: " + restaurant.ClaimStatus);

        restaurant.ClaimStatus = ClaimStatus.Pending;
        restaurant.ClaimedByUserId = userId;
        restaurant.ClaimRequestedAtUtc = DateTime.UtcNow;
        restaurant.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        return restaurant.ToDto();
    }

    public async Task<RestaurantDto> UpdateClaimStateAsync(Guid restaurantId, string state, CancellationToken cancellationToken = default)
    {
        var restaurant = await _repo.GetByIdTrackedAsync(restaurantId, cancellationToken);
        if (restaurant == null)
            throw new KeyNotFoundException("Restaurant not found.");

        if (restaurant.ClaimStatus != ClaimStatus.Pending)
            throw new InvalidOperationException(
                "Claim state can only be updated when status is Pending. Current status: " + restaurant.ClaimStatus);

        var now = DateTime.UtcNow;
        if (string.Equals(state, "Verified", StringComparison.OrdinalIgnoreCase))
        {
            restaurant.ClaimStatus = ClaimStatus.Verified;
            restaurant.OwnershipType = OwnershipType.OwnerManaged;
            restaurant.ClaimReviewedAtUtc = now;
        }
        else if (string.Equals(state, "Rejected", StringComparison.OrdinalIgnoreCase))
        {
            restaurant.ClaimStatus = ClaimStatus.Rejected;
            restaurant.OwnershipType = OwnershipType.Community;
            restaurant.ClaimReviewedAtUtc = now;
        }
        else
            throw new InvalidOperationException("State must be 'Verified' or 'Rejected'. Received: " + (state ?? "<null>"));

        restaurant.UpdatedAtUtc = now;
        await _db.SaveChangesAsync(cancellationToken);
        return restaurant.ToDto();
    }
}
