using Microsoft.EntityFrameworkCore;
using ThatDish.Domain.Entities;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.Services;

/// <summary>
/// Single source for dev-mode "current user" id. Ensures the seed user exists (get-or-create)
/// so create and query flows always use the same user id. Use in both POST /api/dishes and GET /api/dishes/my-contributions.
/// </summary>
public static class DevCurrentUserResolver
{
    public const string SeedExternalId = "seed-claimer";
    public static readonly Guid SeedUserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

    /// <summary>
    /// Returns the seed user's Id. Creates the user if missing (e.g. when seed was skipped because restaurants already existed).
    /// </summary>
    public static async Task<Guid> GetOrCreateSeedUserIdAsync(ThatDishDbContext db, CancellationToken cancellationToken = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.ExternalId == SeedExternalId, cancellationToken);
        if (user != null)
            return user.Id;

        user = new User
        {
            Id = SeedUserId,
            ExternalId = SeedExternalId,
            DisplayName = "Seed Claimer",
            Email = "seed@thatdish.local",
            CreatedAtUtc = DateTime.UtcNow,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);
        return user.Id;
    }
}
