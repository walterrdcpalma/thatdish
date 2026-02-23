using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.DishFamilies;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/dish-families")]
public class DishFamiliesController : ControllerBase
{
    private readonly IDishFamilyRepository _repository;
    private const int DefaultLimit = 20;

    public DishFamiliesController(IDishFamilyRepository repository)
    {
        _repository = repository;
    }

    /// <summary>Search dish families by name for autocomplete.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DishFamilyItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishFamilyItemDto>>> Get([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var list = await _repository.SearchAsync(search ?? string.Empty, DefaultLimit, cancellationToken);
        var dtos = list.Select(f => new DishFamilyItemDto(f.Id, f.Name));
        return Ok(dtos);
    }
}

public record DishFamilyItemDto(Guid Id, string Name);
