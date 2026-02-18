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

    /// <summary>List all restaurants, or search by name when query param 'search' is provided (max 10 results).</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<RestaurantDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(IEnumerable<RestaurantSearchResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var term = search?.Trim();
        if (!string.IsNullOrEmpty(term))
        {
            var results = await _restaurantListService.SearchAsync(term, 10, cancellationToken);
            return Ok(results);
        }
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
