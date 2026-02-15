namespace ThatDish.Application.Dishes;

public class DishListService
{
    private readonly IDishRepository _repo;

    public DishListService(IDishRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<DishListDto>> GetPagedAsync(ListDishesQuery query, CancellationToken cancellationToken = default)
    {
        var dishes = await _repo.GetPagedAsync(
            query.FoodType,
            query.Page,
            query.PageSize,
            cancellationToken);

        return dishes
            .Select(d => new DishListDto(
                d.Id,
                d.Name,
                d.Description,
                d.ImageUrl,
                d.FoodType,
                d.IsMainDish,
                d.Restaurant.Name,
                d.RestaurantId))
            .ToList();
    }
}
