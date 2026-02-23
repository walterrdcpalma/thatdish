using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.Cuisines;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/cuisines")]
public class CuisinesController : ControllerBase
{
    private readonly ICuisineRepository _repository;
    private const int DefaultLimit = 20;

    public CuisinesController(ICuisineRepository repository)
    {
        _repository = repository;
    }

    /// <summary>Search cuisines by name for autocomplete.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CuisineItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CuisineItemDto>>> Get([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var list = await _repository.SearchAsync(search ?? string.Empty, DefaultLimit, cancellationToken);
        var dtos = list.Select(c => new CuisineItemDto(c.Id, c.Name));
        return Ok(dtos);
    }
}

public record CuisineItemDto(Guid Id, string Name);
