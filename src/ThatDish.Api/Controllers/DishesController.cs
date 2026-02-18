using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.Dishes;

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

    /// <summary>List all dishes. No filtering or pagination in this iteration.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DishDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishDto>>> Get(CancellationToken cancellationToken)
    {
        var dishes = await _dishListService.GetDishesAsync(cancellationToken);
        return Ok(dishes);
    }
}
