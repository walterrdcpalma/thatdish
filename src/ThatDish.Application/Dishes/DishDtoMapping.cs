using ThatDish.Domain.Entities;

namespace ThatDish.Application.Dishes;

/// <summary>
/// Maps domain Dish to transport DTO. Keeps mapping in Application layer; controller stays thin.
/// </summary>
public static class DishDtoMapping
{
    public static DishDto ToDto(this Dish dish)
    {
        var savedCount = dish.SavedDishes?.Count ?? 0;
        var savedByUserIds = dish.SavedDishes != null
            ? dish.SavedDishes.Select(s => s.UserId.ToString()).ToArray()
            : Array.Empty<string>();
        var likeCount = dish.Likes?.Count ?? 0;
        var likedByUserIds = dish.Likes != null
            ? dish.Likes.Select(l => l.UserId.ToString()).ToArray()
            : Array.Empty<string>();

        return new DishDto(
            Id: dish.Id,
            Name: dish.Name,
            RestaurantId: dish.RestaurantId,
            RestaurantName: dish.Restaurant?.Name ?? string.Empty,
            Image: string.IsNullOrEmpty(dish.ImageUrl) ? string.Empty : dish.ImageUrl,
            FoodType: dish.FoodType.ToString(),
            DishCategoryId: dish.DishCategoryId,
            DishCategoryName: dish.DishCategory?.Name,
            DishFamilyName: dish.DishCategory?.DishFamily?.Name,
            SavedCount: savedCount,
            SavedByUserIds: savedByUserIds,
            LikeCount: likeCount,
            LikedByUserIds: likedByUserIds,
            CreatedAt: dish.CreatedAtUtc,
            UpdatedAt: dish.UpdatedAtUtc,
            CreatedByUserId: dish.CreatedByUserId?.ToString() ?? string.Empty,
            LastEditedByUserId: null,
            IsArchived: false
        );
    }
}
