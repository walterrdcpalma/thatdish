using ThatDish.Domain.Entities;

namespace ThatDish.Application.Dishes;

/// <summary>
/// Maps domain Dish to transport DTO. Uses aggregate counters; user-context flags set by caller when authenticated.
/// </summary>
public static class DishDtoMapping
{
    public static DishDto ToDto(
        this Dish dish,
        bool? isLikedByCurrentUser = null,
        bool? isSavedByCurrentUser = null,
        int? myRating = null)
    {
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
            LikesCount: dish.LikesCount,
            SavesCount: dish.SavesCount,
            RatingsCount: dish.RatingsCount,
            AverageRating: dish.AverageRating,
            IsLikedByCurrentUser: isLikedByCurrentUser,
            IsSavedByCurrentUser: isSavedByCurrentUser,
            MyRating: myRating,
            CreatedAt: dish.CreatedAtUtc,
            UpdatedAt: dish.UpdatedAtUtc,
            CreatedByUserId: dish.CreatedByUserId?.ToString() ?? string.Empty,
            LastEditedByUserId: null,
            IsArchived: false
        );
    }
}
