using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.Restaurants;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly RestaurantListService _restaurantListService;

    public RestaurantsController(RestaurantListService restaurantListService)
    {
        _restaurantListService = restaurantListService;
    }

    /// <summary>List all restaurants from the database.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RestaurantDto>>> Get(CancellationToken cancellationToken)
    {
        var restaurants = await _restaurantListService.GetRestaurantsAsync(cancellationToken);
        return Ok(restaurants);
    }
}
