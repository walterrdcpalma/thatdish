namespace ThatDish.Domain.Entities;

public class DishFamily
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<DishCategory> Categories { get; set; } = new List<DishCategory>();
}
