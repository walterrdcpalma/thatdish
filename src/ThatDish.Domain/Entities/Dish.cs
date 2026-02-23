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

    /// <summary>Aggregated count of likes (thumbs up). Kept in sync with Likes table.</summary>
    public int LikesCount { get; set; }
    /// <summary>Aggregated count of saves (bookmarks). Kept in sync with SavedDishes table.</summary>
    public int SavesCount { get; set; }
    /// <summary>Aggregated count of ratings. Kept in sync with Ratings table.</summary>
    public int RatingsCount { get; set; }
    /// <summary>Average rating (1-5). 0 when no ratings.</summary>
    public decimal AverageRating { get; set; }

    public Restaurant Restaurant { get; set; } = null!;
    public DishCategory DishCategory { get; set; } = null!;
}
