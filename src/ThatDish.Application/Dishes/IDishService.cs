namespace ThatDish.Application.Dishes;

public interface IDishService
{
    Task<List<DishDto>> GetDishesAsync(CancellationToken cancellationToken = default);
    Task<List<DishDto>> SearchDishesAsync(string query, int limit, CancellationToken cancellationToken = default);
    Task<List<DishListDto>> GetPagedAsync(ListDishesQuery query, CancellationToken cancellationToken = default);
    Task<DishDto> CreateDishAsync(
        string dishName,
        string restaurantName,
        string foodType,
        string image,
        string? cuisineType,
        CancellationToken cancellationToken = default);
}
