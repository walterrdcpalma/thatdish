namespace ThatDish.Application.Restaurants;

public class RestaurantListService
{
    private readonly IRestaurantRepository _repo;

    public RestaurantListService(IRestaurantRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<RestaurantDto>> GetRestaurantsAsync(CancellationToken cancellationToken = default)
    {
        var list = await _repo.GetAllAsync(cancellationToken);
        return list.Select(RestaurantDtoMapping.ToDto).ToList();
    }
}
