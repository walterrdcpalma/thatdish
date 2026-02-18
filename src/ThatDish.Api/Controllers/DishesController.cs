using Microsoft.AspNetCore.Mvc;
using ThatDish.Api.Models;
using ThatDish.Application.Dishes;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly IDishService _dishService;

    public DishesController(IDishService dishService)
    {
        _dishService = dishService;
    }

    /// <summary>List all dishes from the database.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DishDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishDto>>> Get(CancellationToken cancellationToken)
    {
        var dishes = await _dishService.GetDishesAsync(cancellationToken);
        return Ok(dishes);
    }

    /// <summary>Create a new dish. Creates the restaurant if it does not exist.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(DishDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<DishDto>> Create([FromBody] CreateDishRequest request, CancellationToken cancellationToken)
    {
        var dishName = request.DishName?.Trim() ?? string.Empty;
        var restaurantName = request.RestaurantName?.Trim() ?? string.Empty;
        var foodType = request.FoodType?.Trim() ?? string.Empty;
        var image = request.Image?.Trim() ?? string.Empty;

        if (string.IsNullOrEmpty(dishName))
            return BadRequest("DishName is required.");
        if (string.IsNullOrEmpty(restaurantName))
            return BadRequest("RestaurantName is required.");
        if (string.IsNullOrEmpty(foodType))
            return BadRequest("FoodType is required.");

        try
        {
            var dto = await _dishService.CreateDishAsync(dishName, restaurantName, foodType, image, cancellationToken);
            return Created($"/api/dishes/{dto.Id}", dto);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
        {
            return Conflict(ex.Message);
        }
    }
}
