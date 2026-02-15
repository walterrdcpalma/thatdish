using ThatDish.Domain.Enums;

namespace ThatDish.Domain.Entities;

public class Dish
{
    public Guid Id { get; set; }
    public Guid RestaurantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public FoodType FoodType { get; set; }
    public bool IsMainDish { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public Restaurant Restaurant { get; set; } = null!;
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
}
