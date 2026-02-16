using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThatDish.Domain.Entities;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeController : ControllerBase
{
    private readonly ThatDishDbContext _db;

    public MeController(ThatDishDbContext db)
    {
        _db = db;
    }

    /// <summary>Get or sync current user from Supabase JWT. Returns 401 if not authenticated.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(MeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<MeDto>> Get(CancellationToken cancellationToken)
    {
        var sub = User.FindFirst("sub")?.Value;
        var email = User.FindFirst("email")?.Value;
        if (string.IsNullOrEmpty(sub))
            return Unauthorized();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.ExternalId == sub, cancellationToken);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                ExternalId = sub,
                Email = email,
                CreatedAtUtc = DateTime.UtcNow,
            };
            _db.Users.Add(user);
        }
        else
        {
            user.Email = email ?? user.Email;
            user.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new MeDto(user.Id, user.Email, user.DisplayName));
    }

    public record MeDto(Guid Id, string? Email, string? DisplayName);
}
