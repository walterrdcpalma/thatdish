namespace ThatDish.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string ExternalId { get; set; } = string.Empty; // Auth provider id (e.g. Supabase, Auth0)
    public string? Email { get; set; }
    public string? DisplayName { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
}
