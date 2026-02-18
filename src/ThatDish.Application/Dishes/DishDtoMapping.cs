using ThatDish.Domain.Entities;

namespace ThatDish.Application.Dishes;

/// <summary>
/// Maps domain Dish to transport DTO. Keeps mapping in Application layer; controller stays thin.
/// </summary>
public static class DishDtoMapping
{
    public static DishDto ToDto(this Dish dish)
    {
        return new DishDto(
            Id: dish.Id,
            Name: dish.Name,
            RestaurantId: dish.RestaurantId,
            ImagePlaceholder: string.IsNullOrEmpty(dish.ImageUrl) ? null : dish.ImageUrl,
            SavedCount: 0,
            SavedByUserIds: Array.Empty<string>(),
            CreatedAt: dish.CreatedAtUtc,
            UpdatedAt: dish.UpdatedAtUtc,
            CreatedByUserId: string.Empty,
            LastEditedByUserId: null,
            IsArchived: false
        );
    }
}
