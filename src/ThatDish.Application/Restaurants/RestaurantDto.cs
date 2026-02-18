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
    DateTime? UpdatedAtUtc
);
