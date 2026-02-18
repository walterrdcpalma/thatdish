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

    public async Task<RestaurantDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var restaurant = await _repo.GetByIdAsync(id, cancellationToken);
        return restaurant == null ? null : RestaurantDtoMapping.ToDto(restaurant);
    }

    public async Task<List<RestaurantSearchResult>> SearchAsync(string term, int limit, CancellationToken cancellationToken = default)
    {
        return await _repo.SearchByNameAsync(term, limit, cancellationToken);
    }
}
