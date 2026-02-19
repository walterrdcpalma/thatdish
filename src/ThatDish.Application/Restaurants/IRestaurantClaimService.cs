namespace ThatDish.Application.Restaurants;

/// <summary>
/// Handles restaurant claim request and (temporary) claim state updates.
/// Throws <see cref="KeyNotFoundException"/> when restaurant is not found.
/// Throws <see cref="InvalidOperationException"/> for invalid claim transitions (message describes the error).
/// </summary>
public interface IRestaurantClaimService
{
    /// <summary>
    /// Submit a claim for the restaurant. Allowed only when claim status is None or Rejected.
    /// Sets status to Pending, claimedByUserId to current user, claimRequestedAt to UtcNow.
    /// </summary>
    Task<RestaurantDto> SubmitClaimAsync(Guid restaurantId, Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// [TEMPORARY] Update claim state (Verified or Rejected). Allowed only when current status is Pending.
    /// Verified: claimStatus=Verified, ownershipType=OwnerManaged, claimReviewedAt=UtcNow.
    /// Rejected: claimStatus=Rejected, ownershipType=Community, claimReviewedAt=UtcNow.
    /// </summary>
    Task<RestaurantDto> UpdateClaimStateAsync(Guid restaurantId, string state, CancellationToken cancellationToken = default);
}
