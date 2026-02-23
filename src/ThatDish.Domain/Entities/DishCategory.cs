namespace ThatDish.Domain.Entities;

public class DishCategory
{
    public Guid Id { get; set; }
    public Guid DishFamilyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public DishFamily DishFamily { get; set; } = null!;
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();
}
