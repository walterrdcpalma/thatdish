using ThatDish.Domain.Enums;

namespace ThatDish.Domain.Entities;

public class Dish
{
    public Guid Id { get; set; }
    public Guid RestaurantId { get; set; }
    public Guid DishCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public FoodType FoodType { get; set; }
    public bool IsMainDish { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
    /// <summary>User who created the dish. Null for legacy data.</summary>
    public Guid? CreatedByUserId { get; set; }

    public Restaurant Restaurant { get; set; } = null!;
    public DishCategory DishCategory { get; set; } = null!;
    public ICollection<SavedDish> SavedDishes { get; set; } = new List<SavedDish>();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
}
