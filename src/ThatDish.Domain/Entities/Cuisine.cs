namespace ThatDish.Domain.Entities;

public class Cuisine
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();
}
