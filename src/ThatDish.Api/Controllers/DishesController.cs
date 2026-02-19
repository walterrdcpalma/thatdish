using Microsoft.AspNetCore.Mvc;
using ThatDish.Application.Dishes;
using ThatDish.Infrastructure.Persistence;
using ThatDish.Infrastructure.Services;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly IDishService _dishService;
    private readonly IWebHostEnvironment _env;
    private readonly ThatDishDbContext _db;

    public DishesController(IDishService dishService, IWebHostEnvironment env, ThatDishDbContext db)
    {
        _dishService = dishService;
        _env = env;
        _db = db;
    }

    /// <summary>My Contributions: dishes created by current user. Uses shared dev user resolver. Order by createdAt desc.</summary>
    [HttpGet("my-contributions")]
    [ProducesResponseType(typeof(IEnumerable<DishDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DishDto>>> GetMyContributions(CancellationToken cancellationToken)
    {
        var userId = await DevCurrentUserResolver.GetOrCreateSeedUserIdAsync(_db, cancellationToken);
        var list = await _dishService.GetMyContributionsAsync(userId, cancellationToken);
        return Ok(list);
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
        [FromForm] string? foodType,
        [FromForm] string? cuisineType,
        CancellationToken cancellationToken)
    {
        var dishName = name?.Trim() ?? string.Empty;
        var restName = restaurantName?.Trim() ?? string.Empty;
        var foodTypeValue = string.IsNullOrWhiteSpace(foodType) ? "Other" : foodType.Trim();

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

        var createdByUserId = await DevCurrentUserResolver.GetOrCreateSeedUserIdAsync(_db, cancellationToken);

        try
        {
            var dto = await _dishService.CreateDishAsync(dishName, restName, foodTypeValue, imageUrl, cuisineType, createdByUserId, cancellationToken);
            return Created($"/api/dishes/{dto.Id}", dto);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
        {
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
            return Conflict(ex.Message);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("cuisineType"))
        {
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
            return BadRequest(ex.Message);
        }
    }
}
