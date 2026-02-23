using Microsoft.EntityFrameworkCore;
using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;
using ThatDish.Domain.Seeding;

namespace ThatDish.Infrastructure.Persistence;

/// <summary>Seed data aligned with the Supabase/Postgres script. Idempotent: skips if data already present.</summary>
public static class SeedData
{
    /// <summary>Other category ID used by migration (fallback). Script uses SeedIds.Cat* and family "Other" is not in script.</summary>
    public static readonly Guid OtherCategoryId = Guid.Parse("A1000002-0002-0002-0002-000000000002");

    /// <summary>Other cuisine ID used by migration (fallback). Script uses SeedIds.CuisineOther.</summary>
    public static readonly Guid OtherCuisineId = Guid.Parse("C1000001-0001-0001-0001-000000000001");

    public static async Task SeedAsync(ThatDishDbContext db, CancellationToken cancellationToken = default)
    {
        await EnsureUsersAsync(db, cancellationToken);
        await EnsureCuisinesAsync(db, cancellationToken);
        await EnsureDishFamiliesAndCategoriesAsync(db, cancellationToken);
        await EnsureCuisinesBackfillAsync(db, cancellationToken);

        if (await db.Restaurants.AnyAsync(cancellationToken))
            return;

        var now = DateTime.UtcNow;
        var requestedAt = now.AddDays(-5);
        var reviewedAt = now.AddDays(-3);

        // Restaurants (match script: CuisineId + Cuisine string)
        var restaurants = new[]
        {
            new Restaurant
            {
                Id = SeedIds.Rest1,
                Name = SeedRestaurants.Restaurant1.Name,
                Address = "Rua das Flores 12, Lisboa",
                Latitude = 38.7112,
                Longitude = -9.1393,
                ContactInfo = "+351 21 123 4567",
                Cuisine = "Portuguesa",
                CuisineId = SeedIds.CuisinePortuguesa,
                CreatedAtUtc = now,
                OwnershipType = OwnershipType.Community,
                ClaimStatus = ClaimStatus.None,
                ClaimedByUserId = null,
                ClaimRequestedAtUtc = null,
                ClaimReviewedAtUtc = null,
            },
            new Restaurant
            {
                Id = SeedIds.Rest2,
                Name = SeedRestaurants.Restaurant2.Name,
                Address = "Rua de Santa Catarina 45, Porto",
                Latitude = 41.1579,
                Longitude = -8.6291,
                CreatedAtUtc = now,
                Cuisine = "Marisqueira",
                CuisineId = SeedIds.CuisineMarisqueira,
                OwnershipType = OwnershipType.Community,
                ClaimStatus = ClaimStatus.Pending,
                ClaimedByUserId = SeedIds.UserClaimer,
                ClaimRequestedAtUtc = requestedAt,
                ClaimReviewedAtUtc = null,
            },
            new Restaurant
            {
                Id = SeedIds.Rest3,
                Name = SeedRestaurants.Restaurant3.Name,
                Address = "Praça da República 3",
                Latitude = 40.2033,
                Longitude = -8.4103,
                ContactInfo = "bifanas@email.pt",
                Cuisine = "Portuguesa",
                CuisineId = SeedIds.CuisinePortuguesa,
                CreatedAtUtc = now,
                OwnershipType = OwnershipType.OwnerManaged,
                ClaimStatus = ClaimStatus.Verified,
                ClaimedByUserId = SeedIds.UserClaimer,
                ClaimRequestedAtUtc = requestedAt,
                ClaimReviewedAtUtc = reviewedAt,
            },
            new Restaurant
            {
                Id = SeedIds.Rest4,
                Name = SeedRestaurants.Restaurant4.Name,
                Address = "Avenida da Liberdade 100, Lisboa",
                Latitude = 38.7223,
                Longitude = -9.1454,
                CreatedAtUtc = now,
                Cuisine = "Portuguesa",
                CuisineId = SeedIds.CuisinePortuguesa,
                OwnershipType = OwnershipType.Community,
                ClaimStatus = ClaimStatus.Rejected,
                ClaimedByUserId = SeedIds.UserClaimer,
                ClaimRequestedAtUtc = requestedAt,
                ClaimReviewedAtUtc = reviewedAt,
            },
        };
        db.Restaurants.AddRange(restaurants);
        await db.SaveChangesAsync(cancellationToken);

        var dishImageUrls = new[]
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
        static DateTime DaysAgo(DateTime from, int days) => from.AddDays(-days);

        var dishes = new[]
        {
            new Dish
            {
                Id = SeedIds.DishBacalhauBras,
                RestaurantId = SeedIds.Rest1,
                DishCategoryId = SeedIds.CatBacalhauBras,
                Name = "Bacalhau à Brás",
                Description = "Bacalhau desfiado com batata palha, ovo e azeitonas.",
                ImageUrl = dishImageUrls[0],
                FoodType = FoodType.Traditional,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = DaysAgo(now, 30),
                UpdatedAtUtc = DaysAgo(now, 30),
            },
            new Dish
            {
                Id = SeedIds.DishCaldoVerde,
                RestaurantId = SeedIds.Rest1,
                DishCategoryId = SeedIds.CatCaldoVerde,
                Name = "Caldo Verde",
                Description = "Sopa de couve-galega com chouriço e batata.",
                ImageUrl = dishImageUrls[1],
                FoodType = FoodType.Soup,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = DaysAgo(now, 30),
                UpdatedAtUtc = DaysAgo(now, 30),
            },
            new Dish
            {
                Id = SeedIds.DishPastelNata,
                RestaurantId = SeedIds.Rest1,
                DishCategoryId = SeedIds.CatPastelNata,
                Name = "Pastel de Nata",
                Description = "Doce de nata com massa folhada.",
                ImageUrl = dishImageUrls[2],
                FoodType = FoodType.Dessert,
                IsMainDish = false,
                SortOrder = 2,
                CreatedAtUtc = DaysAgo(now, 30),
                UpdatedAtUtc = DaysAgo(now, 30),
            },
            new Dish
            {
                Id = SeedIds.DishArrozMarisco,
                RestaurantId = SeedIds.Rest2,
                DishCategoryId = SeedIds.CatArrozMarisco,
                Name = "Arroz de Marisco",
                Description = "Arroz cremoso com marisco.",
                ImageUrl = dishImageUrls[3],
                FoodType = FoodType.Seafood,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = DaysAgo(now, 1),
                UpdatedAtUtc = DaysAgo(now, 1),
            },
            new Dish
            {
                Id = SeedIds.DishCataplanaAmeijoas,
                RestaurantId = SeedIds.Rest2,
                DishCategoryId = SeedIds.CatCataplanaAmeijoas,
                Name = "Cataplana de Amêijoas",
                Description = "Amêijoas à bulhão pato na cataplana.",
                ImageUrl = dishImageUrls[4],
                FoodType = FoodType.Seafood,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = DaysAgo(now, 2),
                UpdatedAtUtc = DaysAgo(now, 2),
            },
            new Dish
            {
                Id = SeedIds.DishBifanaPao,
                RestaurantId = SeedIds.Rest3,
                DishCategoryId = SeedIds.CatBifanaPao,
                Name = "Bifana no Pão",
                Description = "Carne de porco marinada, grelhada, no pão com mostarda.",
                ImageUrl = dishImageUrls[5],
                FoodType = FoodType.StreetFood,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = DaysAgo(now, 3),
                UpdatedAtUtc = DaysAgo(now, 3),
            },
            new Dish
            {
                Id = SeedIds.DishPregoPao,
                RestaurantId = SeedIds.Rest3,
                DishCategoryId = SeedIds.CatPregoPao,
                Name = "Prego no Pão",
                Description = "Bife de vaca grelhado no pão com manteiga de alho.",
                ImageUrl = dishImageUrls[6],
                FoodType = FoodType.StreetFood,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = DaysAgo(now, 4),
                UpdatedAtUtc = DaysAgo(now, 4),
            },
            new Dish
            {
                Id = SeedIds.DishArrozPato,
                RestaurantId = SeedIds.Rest4,
                DishCategoryId = SeedIds.CatArrozPato,
                Name = "Arroz de Pato",
                Description = "Arroz de pato confitado com chouriço e grelos.",
                ImageUrl = dishImageUrls[7],
                FoodType = FoodType.Rice,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = DaysAgo(now, 5),
                UpdatedAtUtc = DaysAgo(now, 5),
            },
            new Dish
            {
                Id = SeedIds.DishFrancesinha,
                RestaurantId = SeedIds.Rest4,
                DishCategoryId = SeedIds.CatFrancesinha,
                Name = "Francesinha",
                Description = "Sanduíche com carnes, queijo e molho.",
                ImageUrl = dishImageUrls[8],
                FoodType = FoodType.Sandwich,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = DaysAgo(now, 6),
                UpdatedAtUtc = DaysAgo(now, 6),
            },
            new Dish
            {
                Id = SeedIds.DishBowlQuinoa,
                RestaurantId = SeedIds.Rest1,
                DishCategoryId = SeedIds.CatBowlQuinoa,
                Name = "Bowl de Quinoa e Legumes",
                Description = "Quinoa, grão, abacate, tomate e tahini. 100% vegetariano.",
                ImageUrl = dishImageUrls[9],
                FoodType = FoodType.Vegetarian,
                IsMainDish = true,
                SortOrder = 3,
                CreatedAtUtc = DaysAgo(now, 14),
                UpdatedAtUtc = DaysAgo(now, 14),
            },
            new Dish
            {
                Id = SeedIds.DishCremeLegumesVegan,
                RestaurantId = SeedIds.Rest4,
                DishCategoryId = SeedIds.CatCremeLegumesVegan,
                Name = "Creme de Legumes Vegan",
                Description = "Creme de courgette e batata, sem lacticínios.",
                ImageUrl = dishImageUrls[9],
                FoodType = FoodType.Vegan,
                IsMainDish = true,
                SortOrder = 2,
                CreatedAtUtc = DaysAgo(now, 14),
                UpdatedAtUtc = DaysAgo(now, 14),
            },
        };
        db.Dishes.AddRange(dishes);
        await db.SaveChangesAsync(cancellationToken);

        await EnsureLikesAndRatingsAsync(db, now, cancellationToken);
    }

    private static async Task EnsureUsersAsync(ThatDishDbContext db, CancellationToken ct)
    {
        if (await db.Users.AnyAsync(u => u.ExternalId == "seed-claimer", ct))
            return;
        var now = DateTime.UtcNow;
        db.Users.AddRange(
            new User { Id = SeedIds.UserClaimer, ExternalId = "seed-claimer", DisplayName = "Seed Claimer", Email = "seed@thatdish.local", CreatedAtUtc = now },
            new User { Id = SeedIds.User1, ExternalId = "seed-user-1", DisplayName = "Ana Silva", Email = "ana@thatdish.local", CreatedAtUtc = now },
            new User { Id = SeedIds.User2, ExternalId = "seed-user-2", DisplayName = "Bruno Costa", Email = "bruno@thatdish.local", CreatedAtUtc = now },
            new User { Id = SeedIds.User3, ExternalId = "seed-user-3", DisplayName = "Carla Rocha", Email = "carla@thatdish.local", CreatedAtUtc = now },
            new User { Id = SeedIds.User4, ExternalId = "seed-user-4", DisplayName = "Diogo Martins", Email = "diogo@thatdish.local", CreatedAtUtc = now },
            new User { Id = SeedIds.User5, ExternalId = "seed-user-5", DisplayName = "Eva Santos", Email = "eva@thatdish.local", CreatedAtUtc = now }
        );
        await db.SaveChangesAsync(ct);
    }

    private static async Task EnsureCuisinesAsync(ThatDishDbContext db, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        if (!await db.Cuisines.AnyAsync(c => c.Id == SeedIds.CuisinePortuguesa, ct))
            db.Cuisines.Add(new Cuisine { Id = SeedIds.CuisinePortuguesa, Name = "Portuguesa", CreatedAtUtc = now });
        if (!await db.Cuisines.AnyAsync(c => c.Id == SeedIds.CuisineMarisqueira, ct))
            db.Cuisines.Add(new Cuisine { Id = SeedIds.CuisineMarisqueira, Name = "Marisqueira", CreatedAtUtc = now });
        if (!await db.Cuisines.AnyAsync(c => c.Name == "Other", ct))
            db.Cuisines.Add(new Cuisine { Id = SeedIds.CuisineOther, Name = "Other", CreatedAtUtc = now });
        if (db.ChangeTracker.HasChanges())
            await db.SaveChangesAsync(ct);
    }

    private static async Task EnsureDishFamiliesAndCategoriesAsync(ThatDishDbContext db, CancellationToken ct)
    {
        if (await db.DishFamilies.AnyAsync(f => f.Id == SeedIds.FamilyBacalhau, ct))
            return;
        var now = DateTime.UtcNow;
        db.DishFamilies.AddRange(
            new DishFamily { Id = SeedIds.FamilyBacalhau, Name = "Bacalhau", CreatedAtUtc = now },
            new DishFamily { Id = SeedIds.FamilySopas, Name = "Sopas", CreatedAtUtc = now },
            new DishFamily { Id = SeedIds.FamilySobremesas, Name = "Sobremesas", CreatedAtUtc = now },
            new DishFamily { Id = SeedIds.FamilyMarisco, Name = "Marisco", CreatedAtUtc = now },
            new DishFamily { Id = SeedIds.FamilySandes, Name = "Sandes", CreatedAtUtc = now },
            new DishFamily { Id = SeedIds.FamilyArrozes, Name = "Arrozes", CreatedAtUtc = now },
            new DishFamily { Id = SeedIds.FamilyVegetarianoVegan, Name = "Vegetariano e Vegan", CreatedAtUtc = now }
        );
        await db.SaveChangesAsync(ct);

        if (await db.DishCategories.AnyAsync(c => c.Id == SeedIds.CatBacalhauBras, ct))
            return;
        db.DishCategories.AddRange(
            new DishCategory { Id = SeedIds.CatBacalhauBras, DishFamilyId = SeedIds.FamilyBacalhau, Name = "Bacalhau à Brás", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatCaldoVerde, DishFamilyId = SeedIds.FamilySopas, Name = "Caldo Verde", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatPastelNata, DishFamilyId = SeedIds.FamilySobremesas, Name = "Pastel de Nata", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatArrozMarisco, DishFamilyId = SeedIds.FamilyArrozes, Name = "Arroz de Marisco", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatCataplanaAmeijoas, DishFamilyId = SeedIds.FamilyMarisco, Name = "Cataplana de Amêijoas", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatBifanaPao, DishFamilyId = SeedIds.FamilySandes, Name = "Bifana no Pão", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatPregoPao, DishFamilyId = SeedIds.FamilySandes, Name = "Prego no Pão", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatArrozPato, DishFamilyId = SeedIds.FamilyArrozes, Name = "Arroz de Pato", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatFrancesinha, DishFamilyId = SeedIds.FamilySandes, Name = "Francesinha", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatBowlQuinoa, DishFamilyId = SeedIds.FamilyVegetarianoVegan, Name = "Bowl de Quinoa e Legumes", CreatedAtUtc = now },
            new DishCategory { Id = SeedIds.CatCremeLegumesVegan, DishFamilyId = SeedIds.FamilyVegetarianoVegan, Name = "Creme de Legumes Vegan", CreatedAtUtc = now }
        );
        await db.SaveChangesAsync(ct);
    }

    private static async Task EnsureLikesAndRatingsAsync(ThatDishDbContext db, DateTime now, CancellationToken ct)
    {
        var userIds = new[] { SeedIds.User1, SeedIds.User2, SeedIds.User3, SeedIds.User4, SeedIds.User5 };
        var dishIds = new[]
        {
            SeedIds.DishBacalhauBras, SeedIds.DishCaldoVerde, SeedIds.DishPastelNata, SeedIds.DishArrozMarisco,
            SeedIds.DishCataplanaAmeijoas, SeedIds.DishBifanaPao, SeedIds.DishPregoPao, SeedIds.DishArrozPato,
            SeedIds.DishFrancesinha, SeedIds.DishBowlQuinoa, SeedIds.DishCremeLegumesVegan
        };

        // Saved (bookmarks): seed when empty
        if (!await db.SavedDishes.AnyAsync(ct))
        {
            var saved = new List<SavedDish>
            {
                new SavedDish { Id = SeedIds.Like1, UserId = SeedIds.User1, DishId = SeedIds.DishFrancesinha, CreatedAtUtc = now.AddDays(-1) },
                new SavedDish { Id = SeedIds.Like2, UserId = SeedIds.User2, DishId = SeedIds.DishFrancesinha, CreatedAtUtc = now.AddDays(-1) },
                new SavedDish { Id = SeedIds.Like3, UserId = SeedIds.User3, DishId = SeedIds.DishFrancesinha, CreatedAtUtc = now.AddDays(-2) },
                new SavedDish { Id = SeedIds.Like4, UserId = SeedIds.User4, DishId = SeedIds.DishBacalhauBras, CreatedAtUtc = now.AddDays(-3) }
            };
            var rndSaved = new Random(42);
            var usedSavedPairs = new HashSet<(Guid, Guid)> { (SeedIds.User1, SeedIds.DishFrancesinha), (SeedIds.User2, SeedIds.DishFrancesinha), (SeedIds.User3, SeedIds.DishFrancesinha), (SeedIds.User4, SeedIds.DishBacalhauBras) };
            for (int i = 0; i < 25; i++)
            {
                var user = userIds[rndSaved.Next(userIds.Length)];
                var dish = dishIds[rndSaved.Next(dishIds.Length)];
                if (usedSavedPairs.Add((user, dish)))
                {
                    var id = Guid.Parse($"90000000-0000-0000-0000-0000000000{(5 + i):x2}");
                    saved.Add(new SavedDish { Id = id, UserId = user, DishId = dish, CreatedAtUtc = now.AddDays(-rndSaved.Next(1, 30)) });
                }
            }
            db.SavedDishes.AddRange(saved);
            await db.SaveChangesAsync(ct);
        }

        // Likes (thumbs up): seed random likes per dish when empty
        if (!await db.Likes.AnyAsync(ct))
        {
            var rndLike = new Random(123);
            var likes = new List<Like>();
            var usedLikePairs = new HashSet<(Guid, Guid)>();
            for (int i = 0; i < 40; i++)
            {
                var user = userIds[rndLike.Next(userIds.Length)];
                var dish = dishIds[rndLike.Next(dishIds.Length)];
                if (usedLikePairs.Add((user, dish)))
                    likes.Add(new Like { Id = Guid.NewGuid(), UserId = user, DishId = dish, CreatedAtUtc = now.AddDays(-rndLike.Next(1, 30)) });
            }
            db.Likes.AddRange(likes);
            await db.SaveChangesAsync(ct);
        }

        if (await db.Ratings.AnyAsync(ct))
            return;

        var ratings = new List<Rating>
        {
            new Rating { Id = SeedIds.Rating1, UserId = SeedIds.User1, DishId = SeedIds.DishFrancesinha, Score = 5, CreatedAtUtc = now.AddDays(-1) },
            new Rating { Id = SeedIds.Rating2, UserId = SeedIds.User2, DishId = SeedIds.DishFrancesinha, Score = 5, CreatedAtUtc = now.AddDays(-1) },
            new Rating { Id = SeedIds.Rating3, UserId = SeedIds.User3, DishId = SeedIds.DishBacalhauBras, Score = 4, CreatedAtUtc = now.AddDays(-3) },
            new Rating { Id = SeedIds.Rating4, UserId = SeedIds.User4, DishId = SeedIds.DishBacalhauBras, Score = 5, CreatedAtUtc = now.AddDays(-4) }
        };

        var rndRating = new Random(42);
        var usedRatingPairs = new HashSet<(Guid, Guid)> { (SeedIds.User1, SeedIds.DishFrancesinha), (SeedIds.User2, SeedIds.DishFrancesinha), (SeedIds.User3, SeedIds.DishBacalhauBras), (SeedIds.User4, SeedIds.DishBacalhauBras) };
        for (int i = 0; i < 25; i++)
        {
            var user = userIds[rndRating.Next(userIds.Length)];
            var dish = dishIds[rndRating.Next(dishIds.Length)];
            if (usedRatingPairs.Add((user, dish)))
            {
                var score = 3 + rndRating.Next(3);
                var ratingId = Guid.Parse($"91000000-0000-0000-0000-0000000000{(5 + i):x2}");
                ratings.Add(new Rating { Id = ratingId, UserId = user, DishId = dish, Score = score, CreatedAtUtc = now.AddDays(-rndRating.Next(1, 30)) });
            }
        }
        db.Ratings.AddRange(ratings);
        await db.SaveChangesAsync(ct);
    }

    /// <summary>Backfill CuisineId from existing Restaurants.Cuisine (distinct names). Run after migration.</summary>
    private static async Task EnsureCuisinesBackfillAsync(ThatDishDbContext db, CancellationToken cancellationToken)
    {
        var restaurants = await db.Restaurants
            .Where(r => r.Cuisine != null && r.Cuisine.Trim() != "" && r.CuisineId == null)
            .ToListAsync(cancellationToken);
        if (restaurants.Count == 0) return;

        var distinctNames = restaurants.Select(r => r.Cuisine!.Trim()).Distinct().ToList();
        foreach (var name in distinctNames)
        {
            var cuisine = await db.Cuisines.FirstOrDefaultAsync(c => c.Name == name, cancellationToken);
            if (cuisine == null)
            {
                cuisine = new Cuisine { Id = Guid.NewGuid(), Name = name, CreatedAtUtc = DateTime.UtcNow };
                db.Cuisines.Add(cuisine);
                await db.SaveChangesAsync(cancellationToken);
            }
            foreach (var r in restaurants.Where(r => r.Cuisine?.Trim() == name))
                r.CuisineId = cuisine.Id;
        }
        await db.SaveChangesAsync(cancellationToken);
    }
}
