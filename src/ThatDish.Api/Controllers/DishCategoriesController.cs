using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.DishCategories;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/dish-categories")]
public class DishCategoriesController : ControllerBase
{
    private readonly IDishCategoryRepository _repository;
    private const int DefaultLimit = 20;

    public DishCategoriesController(IDishCategoryRepository repository)
    {
        _repository = repository;
    }

    /// <summary>Search dish categories by family and optional name for autocomplete.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DishCategoryItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<DishCategoryItemDto>>> Get(
        [FromQuery] Guid? familyId,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        if (!familyId.HasValue || familyId.Value == Guid.Empty)
            return BadRequest("familyId is required.");
        var list = await _repository.SearchByFamilyAsync(familyId.Value, search, DefaultLimit, cancellationToken);
        var dtos = list.Select(c => new DishCategoryItemDto(c.Id, c.Name, c.DishFamilyId));
        return Ok(dtos);
    }
}

public record DishCategoryItemDto(Guid Id, string Name, Guid DishFamilyId);
