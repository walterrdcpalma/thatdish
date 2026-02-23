namespace ThatDish.Domain.Entities;

/// <summary>User gave a like (thumbs up) to this dish. Distinct from SavedDish (saved to list).</summary>
public class Like
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid DishId { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public User User { get; set; } = null!;
    public Dish Dish { get; set; } = null!;
}
