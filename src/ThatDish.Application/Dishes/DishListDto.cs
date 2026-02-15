using ThatDish.Domain.Enums;

namespace ThatDish.Application.Dishes;

public record DishListDto(
    Guid Id,
    string Name,
    string? Description,
    string ImageUrl,
    FoodType FoodType,
    bool IsMainDish,
    string RestaurantName,
    Guid RestaurantId
);
