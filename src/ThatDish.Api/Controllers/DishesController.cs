using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.Dishes;
using ThatDish.Domain.Enums;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly DishListService _dishListService;

    public DishesController(DishListService dishListService)
    {
        _dishListService = dishListService;
    }

    /// <summary>List dishes with optional filter by food type and pagination.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DishListDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishListDto>>> Get(
        [FromQuery] FoodType? foodType,
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        CancellationToken cancellationToken)
    {
        var query = new ListDishesQuery(
            foodType,
            page ?? 1,
            Math.Clamp(pageSize ?? 20, 1, 100));
        var dishes = await _dishListService.GetPagedAsync(query, cancellationToken);
        return Ok(dishes);
    }
}
