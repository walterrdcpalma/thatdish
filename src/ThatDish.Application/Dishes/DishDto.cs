namespace ThatDish.Application.Dishes;

/// <summary>
/// Transport DTO for Dish. Shape aligned with frontend Dish type for future API integration.
/// </summary>
public record DishDto(
    Guid Id,
    string Name,
    Guid RestaurantId,
    string RestaurantName,
    string Image,
    string FoodType,
    Guid DishCategoryId,
    string? DishCategoryName,
    string? DishFamilyName,
    int SavedCount,
    IReadOnlyList<string> SavedByUserIds,
    int LikeCount,
    IReadOnlyList<string> LikedByUserIds,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    string CreatedByUserId,
    string? LastEditedByUserId,
    bool IsArchived
);
