using ThatDish.Domain.Seeding;

namespace ThatDish.Application.Dishes;

/// <summary>
/// Returns the same dish data as the DB seed, in memory. No DB access.
/// </summary>
public static class StaticDishSeed
{
    private static readonly string[] DishImageUrls =
    {
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1467003909585-2f8a72700288.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1482049016688-2d3e1b311543.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1484723091739-30a097e8f929.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1512621776951-a57141f2eefd.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1546069901-ba9599a7e63c.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1555939594-58d7cb561ad1.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1565299624946-b28f40a0ae38.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1565958011703-44f9829ba187.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/photo-1567620905732-2d1ec7ab7445.avif",
        "https://cobqkcfbdolzjqawxcej.supabase.co/storage/v1/object/public/dish-images/premium_photo-1675252369719-dd52bc69c3df.avif",
    };

    /// <summary>Returns the 11 seed dishes as DTOs. Dates relative to "now" at call time.</summary>
    public static IReadOnlyList<DishDto> GetDishes()
    {
        var now = DateTime.UtcNow;
        static DateTime DaysAgo(DateTime from, int days) => from.AddDays(-days);

        return new DishDto[]
        {
            new(SeedIds.DishBacalhauBras, "Bacalhau à Brás", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[0], "Traditional", SeedIds.CatBacalhauBras, "Bacalhau à Brás", "Bacalhau", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(SeedIds.DishCaldoVerde, "Caldo Verde", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[1], "Soup", SeedIds.CatCaldoVerde, "Caldo Verde", "Sopas", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(SeedIds.DishPastelNata, "Pastel de Nata", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[2], "Dessert", SeedIds.CatPastelNata, "Pastel de Nata", "Sobremesas", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 30), DaysAgo(now, 30), string.Empty, null, false),
            new(SeedIds.DishArrozMarisco, "Arroz de Marisco", SeedRestaurants.Restaurant2.Id, SeedRestaurants.Restaurant2.Name, DishImageUrls[3], "Seafood", SeedIds.CatArrozMarisco, "Arroz de Marisco", "Arrozes", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 1), DaysAgo(now, 1), string.Empty, null, false),
            new(SeedIds.DishCataplanaAmeijoas, "Cataplana de Amêijoas", SeedRestaurants.Restaurant2.Id, SeedRestaurants.Restaurant2.Name, DishImageUrls[4], "Seafood", SeedIds.CatCataplanaAmeijoas, "Cataplana de Amêijoas", "Marisco", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 2), DaysAgo(now, 2), string.Empty, null, false),
            new(SeedIds.DishBifanaPao, "Bifana no Pão", SeedRestaurants.Restaurant3.Id, SeedRestaurants.Restaurant3.Name, DishImageUrls[5], "StreetFood", SeedIds.CatBifanaPao, "Bifana no Pão", "Sandes", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 3), DaysAgo(now, 3), string.Empty, null, false),
            new(SeedIds.DishPregoPao, "Prego no Pão", SeedRestaurants.Restaurant3.Id, SeedRestaurants.Restaurant3.Name, DishImageUrls[6], "StreetFood", SeedIds.CatPregoPao, "Prego no Pão", "Sandes", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 4), DaysAgo(now, 4), string.Empty, null, false),
            new(SeedIds.DishArrozPato, "Arroz de Pato", SeedRestaurants.Restaurant4.Id, SeedRestaurants.Restaurant4.Name, DishImageUrls[7], "Rice", SeedIds.CatArrozPato, "Arroz de Pato", "Arrozes", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 5), DaysAgo(now, 5), string.Empty, null, false),
            new(SeedIds.DishFrancesinha, "Francesinha", SeedRestaurants.Restaurant4.Id, SeedRestaurants.Restaurant4.Name, DishImageUrls[8], "Sandwich", SeedIds.CatFrancesinha, "Francesinha", "Sandes", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 6), DaysAgo(now, 6), string.Empty, null, false),
            new(SeedIds.DishBowlQuinoa, "Bowl de Quinoa e Legumes", SeedRestaurants.Restaurant1.Id, SeedRestaurants.Restaurant1.Name, DishImageUrls[9], "Vegetarian", SeedIds.CatBowlQuinoa, "Bowl de Quinoa e Legumes", "Vegetariano e Vegan", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 14), DaysAgo(now, 14), string.Empty, null, false),
            new(SeedIds.DishCremeLegumesVegan, "Creme de Legumes Vegan", SeedRestaurants.Restaurant4.Id, SeedRestaurants.Restaurant4.Name, DishImageUrls[9], "Vegan", SeedIds.CatCremeLegumesVegan, "Creme de Legumes Vegan", "Vegetariano e Vegan", 0, 0, 0, 0m, null, null, null, DaysAgo(now, 14), DaysAgo(now, 14), string.Empty, null, false),
        };
    }
}
