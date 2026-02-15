namespace ThatDish.Domain.Entities;

public class Like
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid DishId { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public User User { get; set; } = null!;
    public Dish Dish { get; set; } = null!;
}
