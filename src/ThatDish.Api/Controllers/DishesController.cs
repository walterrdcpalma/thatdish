using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.Dishes;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly DishListService _dishListService;
    private readonly IWebHostEnvironment _env;

    public DishesController(DishListService dishListService, IWebHostEnvironment env)
    {
        _dishListService = dishListService;
        _env = env;
    }

    /// <summary>List all dishes. In Development returns static seed (no DB). Otherwise uses repository.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DishDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishDto>>> Get(CancellationToken cancellationToken)
    {
        if (_env.IsDevelopment())
        {
            var dishes = StaticDishSeed.GetDishes();
            return Ok(dishes);
        }
        var dishesFromDb = await _dishListService.GetDishesAsync(cancellationToken);
        return Ok(dishesFromDb);
    }
}
