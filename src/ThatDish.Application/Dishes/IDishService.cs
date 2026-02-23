namespace ThatDish.Application.Dishes;

public interface IDishService
{
    Task<List<DishDto>> GetDishesAsync(CancellationToken cancellationToken = default);
    Task<List<DishDto>> SearchDishesAsync(string query, int limit, CancellationToken cancellationToken = default);
    Task<List<DishListDto>> GetPagedAsync(ListDishesQuery query, CancellationToken cancellationToken = default);
    Task<DishDto> CreateDishAsync(
        string dishName,
        string restaurantName,
        string dishFamilyName,
        string dishCategoryName,
        string foodType,
        string image,
        string? cuisineType,
        Guid? createdByUserId,
        CancellationToken cancellationToken = default);
    /// <summary>Dishes created by the given user (for My Contributions). Order by CreatedAtUtc desc.</summary>
    Task<List<DishDto>> GetMyContributionsAsync(Guid userId, CancellationToken cancellationToken = default);
}
