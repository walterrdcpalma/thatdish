using ThatDish.Domain.Seeding;

namespace ThatDish.Application.Dishes;

/// <summary>
/// Returns the same dish data as the DB seed, in memory. Uses SeedRestaurants (Domain) for IDs and names.
/// </summary>
public static class StaticDishSeed
{
    private static readonly string[] DishImageUrls =
    {
        "https://picsum.photos/seed/dish-1-piri-piri/800/500",
        "https://picsum.photos/seed/dish-2-burger/800/500",
        "https://picsum.photos/seed/dish-3-bacalhau/800/500",
        "https://picsum.photos/seed/dish-4-sardines/800/500",
        "https://picsum.photos/seed/dish-5-caldo/800/500",
        "https://picsum.photos/seed/dish-6-tacos/800/500",
        "https://picsum.photos/seed/dish-7-salad/800/500",
        "https://picsum.photos/seed/dish-8-octopus/800/500",
        "https://picsum.photos/seed/dish-9-nata/800/500",
        "https://picsum.photos/seed/dish-10-arroz/800/500",
    };

    /// <summary>
    /// Returns the list of seed dishes as DTOs. No DB access. Dates are relative to "now" at call time.
    /// </summary>
    public static IReadOnlyList<DishDto> GetDishes()
    {
        var now = DateTime.UtcNow;
        static DateTime DaysAgo(DateTime from, int days) => from.AddDays(-days);

        return new DishDto[]
        {
            new(Guid.Parse("a0000001-0001-0001-0001-000000000001"), "Bacalhau à Brás", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[0], "Traditional", 0, Array.Empty<string>(), DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(Guid.Parse("a0000001-0001-0001-0001-000000000002"), "Caldo Verde", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[1], "Soup", 0, Array.Empty<string>(), DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(Guid.Parse("a0000001-0001-0001-0001-000000000003"), "Pastel de Nata", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[2], "Dessert", 0, Array.Empty<string>(), DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(Guid.Parse("b0000002-0002-0002-0002-000000000001"), "Arroz de Marisco", SeedRestaurants.Restaurant2.Id, SeedRestaurants.Restaurant2.Name, DishImageUrls[3], "Seafood", 0, Array.Empty<string>(), DaysAgo(now, 1), DaysAgo(now, 1), string.Empty, null, false),
            new(Guid.Parse("b0000002-0002-0002-0002-000000000002"), "Cataplana de Amêijoas", SeedRestaurants.Restaurant2.Id, SeedRestaurants.Restaurant2.Name, DishImageUrls[4], "Seafood", 0, Array.Empty<string>(), DaysAgo(now, 2), DaysAgo(now, 2), string.Empty, null, false),
            new(Guid.Parse("c0000003-0003-0003-0003-000000000001"), "Bifana no Pão", SeedRestaurants.Restaurant3.Id, SeedRestaurants.Restaurant3.Name, DishImageUrls[5], "StreetFood", 0, Array.Empty<string>(), DaysAgo(now, 3), DaysAgo(now, 3), string.Empty, null, false),
            new(Guid.Parse("c0000003-0003-0003-0003-000000000002"), "Prego no Pão", SeedRestaurants.Restaurant3.Id, SeedRestaurants.Restaurant3.Name, DishImageUrls[6], "StreetFood", 0, Array.Empty<string>(), DaysAgo(now, 4), DaysAgo(now, 4), string.Empty, null, false),
            new(Guid.Parse("d0000004-0004-0004-0004-000000000001"), "Arroz de Pato", SeedRestaurants.Restaurant4.Id, SeedRestaurants.Restaurant4.Name, DishImageUrls[7], "Rice", 0, Array.Empty<string>(), DaysAgo(now, 5), DaysAgo(now, 5), string.Empty, null, false),
            new(Guid.Parse("d0000004-0004-0004-0004-000000000002"), "Francesinha", SeedRestaurants.Restaurant4.Id, SeedRestaurants.Restaurant4.Name, DishImageUrls[8], "Sandwich", 0, Array.Empty<string>(), DaysAgo(now, 6), DaysAgo(now, 6), string.Empty, null, false),
            new(Guid.Parse("e0000005-0005-0005-0005-000000000001"), "Bowl de Quinoa e Legumes", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[9], "Vegetarian", 0, Array.Empty<string>(), DaysAgo(now, 14), DaysAgo(now, 14), string.Empty, null, false),
            new(Guid.Parse("e0000005-0005-0005-0005-000000000002"), "Creme de Legumes Vegan", SeedRestaurants.Restaurant4.Id, SeedRestaurants.Restaurant4.Name, DishImageUrls[9], "Vegan", 0, Array.Empty<string>(), DaysAgo(now, 14), DaysAgo(now, 14), string.Empty, null, false),
        };
    }
}
