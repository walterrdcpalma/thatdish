namespace ThatDish.Application.Dishes;

/// <summary>
/// Transport DTO for Dish. Shape aligned with frontend Dish type for future API integration.
/// </summary>
public record DishDto(
    Guid Id,
    string Name,
    Guid RestaurantId,
    string Image,
    string FoodType,
    int SavedCount,
    IReadOnlyList<string> SavedByUserIds,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    string CreatedByUserId,
    string? LastEditedByUserId,
    bool IsArchived
);
