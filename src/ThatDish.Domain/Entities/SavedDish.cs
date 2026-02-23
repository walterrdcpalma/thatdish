namespace ThatDish.Domain.Entities;

/// <summary>User saved this dish to their list (bookmark). Distinct from Like (thumbs up).</summary>
public class SavedDish
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid DishId { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public User User { get; set; } = null!;
    public Dish Dish { get; set; } = null!;
}
