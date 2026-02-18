namespace ThatDish.Api.Models;

public class CreateDishRequest
{
    public string DishName { get; set; } = string.Empty;
    public string RestaurantName { get; set; } = string.Empty;
    public string FoodType { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
}
