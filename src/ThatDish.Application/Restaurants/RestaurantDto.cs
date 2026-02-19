using ThatDish.Domain.Enums;

namespace ThatDish.Application.Restaurants;

/// <summary>
/// Transport DTO for Restaurant. Exposed as camelCase JSON from GET /api/restaurants.
/// </summary>
public record RestaurantDto(
    Guid Id,
    string Name,
    string? Address,
    double? Latitude,
    double? Longitude,
    string? ContactInfo,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    OwnershipType OwnershipType,
    ClaimStatus ClaimStatus,
    Guid? ClaimedByUserId,
    DateTime? ClaimRequestedAtUtc,
    DateTime? ClaimReviewedAtUtc
);
