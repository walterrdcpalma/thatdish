using ThatDish.Domain.Enums;

namespace ThatDish.Application.Dishes;

public record ListDishesQuery(FoodType? FoodType, int Page = 1, int PageSize = 20);
