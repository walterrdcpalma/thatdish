namespace ThatDish.Application.Dishes;

/// <summary>
/// Returns the same dish data as the DB seed, in memory. Use in Development so GET /api/dishes does not depend on DB.
/// </summary>
public static class StaticDishSeed
{
    private static readonly Guid Restaurant1Id = Guid.Parse("11111111-1111-1111-1111-111111111101");
    private static readonly Guid Restaurant2Id = Guid.Parse("22222222-2222-2222-2222-222222222202");
    private static readonly Guid Restaurant3Id = Guid.Parse("33333333-3333-3333-3333-333333333303");
    private static readonly Guid Restaurant4Id = Guid.Parse("44444444-4444-4444-4444-444444444404");

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
            new(Guid.Parse("a0000001-0001-0001-0001-000000000001"), "Bacalhau à Brás", Restaurant1Id, DishImageUrls[0], "Traditional", 0, Array.Empty<string>(), DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(Guid.Parse("a0000001-0001-0001-0001-000000000002"), "Caldo Verde", Restaurant1Id, DishImageUrls[1], "Soup", 0, Array.Empty<string>(), DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(Guid.Parse("a0000001-0001-0001-0001-000000000003"), "Pastel de Nata", Restaurant1Id, DishImageUrls[2], "Dessert", 0, Array.Empty<string>(), DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(Guid.Parse("b0000002-0002-0002-0002-000000000001"), "Arroz de Marisco", Restaurant2Id, DishImageUrls[3], "Seafood", 0, Array.Empty<string>(), DaysAgo(now, 1), DaysAgo(now, 1), string.Empty, null, false),
            new(Guid.Parse("b0000002-0002-0002-0002-000000000002"), "Cataplana de Amêijoas", Restaurant2Id, DishImageUrls[4], "Seafood", 0, Array.Empty<string>(), DaysAgo(now, 2), DaysAgo(now, 2), string.Empty, null, false),
            new(Guid.Parse("c0000003-0003-0003-0003-000000000001"), "Bifana no Pão", Restaurant3Id, DishImageUrls[5], "StreetFood", 0, Array.Empty<string>(), DaysAgo(now, 3), DaysAgo(now, 3), string.Empty, null, false),
            new(Guid.Parse("c0000003-0003-0003-0003-000000000002"), "Prego no Pão", Restaurant3Id, DishImageUrls[6], "StreetFood", 0, Array.Empty<string>(), DaysAgo(now, 4), DaysAgo(now, 4), string.Empty, null, false),
            new(Guid.Parse("d0000004-0004-0004-0004-000000000001"), "Arroz de Pato", Restaurant4Id, DishImageUrls[7], "Rice", 0, Array.Empty<string>(), DaysAgo(now, 5), DaysAgo(now, 5), string.Empty, null, false),
            new(Guid.Parse("d0000004-0004-0004-0004-000000000002"), "Francesinha", Restaurant4Id, DishImageUrls[8], "Sandwich", 0, Array.Empty<string>(), DaysAgo(now, 6), DaysAgo(now, 6), string.Empty, null, false),
            new(Guid.Parse("e0000005-0005-0005-0005-000000000001"), "Bowl de Quinoa e Legumes", Restaurant1Id, DishImageUrls[9], "Vegetarian", 0, Array.Empty<string>(), DaysAgo(now, 14), DaysAgo(now, 14), string.Empty, null, false),
            new(Guid.Parse("e0000005-0005-0005-0005-000000000002"), "Creme de Legumes Vegan", Restaurant4Id, DishImageUrls[9], "Vegan", 0, Array.Empty<string>(), DaysAgo(now, 14), DaysAgo(now, 14), string.Empty, null, false),
        };
    }
}
