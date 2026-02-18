using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.Dishes;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly IDishService _dishService;
    private readonly IWebHostEnvironment _env;

    public DishesController(IDishService dishService, IWebHostEnvironment env)
    {
        _dishService = dishService;
        _env = env;
    }

    /// <summary>List all dishes from the database.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DishDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishDto>>> Get(CancellationToken cancellationToken)
    {
        var dishes = await _dishService.GetDishesAsync(cancellationToken);
        return Ok(dishes);
    }

    /// <summary>Search dishes by name or restaurant name. Returns up to 50 results. Excludes archived.</summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<DishDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishDto>>> Search([FromQuery] string? query, CancellationToken cancellationToken)
    {
        var results = await _dishService.SearchDishesAsync(query ?? string.Empty, 50, cancellationToken);
        return Ok(results);
    }

    /// <summary>Create a new dish with image upload (multipart/form-data). Creates the restaurant if it does not exist.</summary>
    [HttpPost]
    [DisableRequestSizeLimit]
    [RequestFormLimits(MultipartBodyLengthLimit = 10 * 1024 * 1024)]
    [ProducesResponseType(typeof(DishDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<DishDto>> Create(
        [FromForm] string name,
        [FromForm] string restaurantName,
        [FromForm] IFormFile? image,
        CancellationToken cancellationToken)
    {
        var dishName = name?.Trim() ?? string.Empty;
        var restName = restaurantName?.Trim() ?? string.Empty;

        if (string.IsNullOrEmpty(dishName))
            return BadRequest("name is required.");
        if (string.IsNullOrEmpty(restName))
            return BadRequest("restaurantName is required.");
        if (image == null || image.Length == 0)
            return BadRequest("image is required.");

        var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var extension = Path.GetExtension(image.FileName).TrimStart('.');
        if (string.IsNullOrEmpty(extension))
            extension = "jpg";
        var fileName = $"{Guid.NewGuid():N}.{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            await image.CopyToAsync(stream, cancellationToken);
        }

        var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";

        try
        {
            var dto = await _dishService.CreateDishAsync(dishName, restName, "Other", imageUrl, cancellationToken);
            return Created($"/api/dishes/{dto.Id}", dto);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
        {
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
            return Conflict(ex.Message);
        }
    }
}
