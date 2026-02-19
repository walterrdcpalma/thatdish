using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThatDish.Api.Models;
using ThatDish.Application.Restaurants;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly RestaurantListService _restaurantListService;
    private readonly IRestaurantClaimService _claimService;
    private readonly ThatDishDbContext _db;

    public RestaurantsController(
        RestaurantListService restaurantListService,
        IRestaurantClaimService claimService,
        ThatDishDbContext db)
    {
        _restaurantListService = restaurantListService;
        _claimService = claimService;
        _db = db;
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

    /// <summary>My Restaurants: list where current user is claimer (Pending, Verified, or Rejected). Uses seed user.</summary>
    [HttpGet("mine")]
    [ProducesResponseType(typeof(IEnumerable<RestaurantDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<IEnumerable<RestaurantDto>>> GetMine(CancellationToken cancellationToken)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.ExternalId == "seed-claimer", cancellationToken);
        if (user == null)
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "Seed user not found. Run seed first.");
        var list = await _restaurantListService.GetMyRestaurantsAsync(user.Id, cancellationToken);
        return Ok(list);
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

    /// <summary>Submit a claim for the restaurant. Allowed when claim status is None or Rejected. Uses seed user (no auth check).</summary>
    [HttpPost("{id:guid}/claims")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<RestaurantDto>> SubmitClaim(Guid id, CancellationToken cancellationToken)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.ExternalId == "seed-claimer", cancellationToken);
        if (user == null)
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "Seed user not found. Run seed first.");
        try
        {
            var dto = await _claimService.SubmitClaimAsync(id, user.Id, cancellationToken);
            return Ok(dto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// [TEMPORARY] Update claim state to Verified or Rejected. Only valid when current status is Pending.
    /// Replace with admin module when available.
    /// </summary>
    [HttpPatch("{id:guid}/claim-state")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RestaurantDto>> UpdateClaimState(
        Guid id,
        [FromBody] UpdateClaimStateRequest request,
        CancellationToken cancellationToken)
    {
        if (request?.State == null)
            return BadRequest("State is required.");
        try
        {
            var dto = await _claimService.UpdateClaimStateAsync(id, request.State, cancellationToken);
            return Ok(dto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
