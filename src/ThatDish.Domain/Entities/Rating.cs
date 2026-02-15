namespace ThatDish.Domain.Entities;

public class Rating
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid DishId { get; set; }
    public int Score { get; set; } // 1-5
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public User User { get; set; } = null!;
    public Dish Dish { get; set; } = null!;
}
