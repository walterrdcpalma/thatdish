namespace ThatDish.Application.Restaurants;

/// <summary>
/// Lightweight DTO for restaurant search (GET /api/restaurants?search=).
/// </summary>
public record RestaurantSearchResult(Guid Id, string Name);
