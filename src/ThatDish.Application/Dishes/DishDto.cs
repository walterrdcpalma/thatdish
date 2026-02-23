namespace ThatDish.Application.Dishes;

/// <summary>
/// Transport DTO for Dish. Aggregates only; user-context flags optional when authenticated.
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
    int LikesCount,
    int SavesCount,
    int RatingsCount,
    decimal AverageRating,
    bool? IsLikedByCurrentUser,
    bool? IsSavedByCurrentUser,
    int? MyRating,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    string CreatedByUserId,
    string? LastEditedByUserId,
    bool IsArchived
);
