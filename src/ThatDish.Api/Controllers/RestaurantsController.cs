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

    /// <summary>Get a single restaurant by id.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RestaurantDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var restaurant = await _restaurantListService.GetByIdAsync(id, cancellationToken);
        if (restaurant == null)
            return NotFound();
        return Ok(restaurant);
    }
}
