using ThatDish.Domain.Enums;

namespace ThatDish.Domain.Entities;

public class Restaurant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    /// <summary>Legacy string; prefer CuisineId. Kept for migration and backward compatibility.</summary>
    public string? Cuisine { get; set; }
    public Guid? CuisineId { get; set; }
    public string? Address { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? ContactInfo { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public OwnershipType OwnershipType { get; set; } = OwnershipType.Community;
    public ClaimStatus ClaimStatus { get; set; } = ClaimStatus.None;
    public Guid? ClaimedByUserId { get; set; }
    public DateTime? ClaimRequestedAtUtc { get; set; }
    public DateTime? ClaimReviewedAtUtc { get; set; }

    public Cuisine? CuisineNavigation { get; set; }
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();
}
