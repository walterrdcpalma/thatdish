using Microsoft.EntityFrameworkCore;
using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;
using ThatDish.Domain.Seeding;

namespace ThatDish.Infrastructure.Persistence;

public static class SeedData
{
    /// <summary>Seed user used as claimer in claim scenarios (Pending, Verified, Rejected).</summary>
    private static readonly Guid SeedClaimerUserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

    public static async Task SeedAsync(ThatDishDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Restaurants.AnyAsync(cancellationToken))
            return;

        var now = DateTime.UtcNow;
        var r1 = SeedRestaurants.Restaurant1;
        var r2 = SeedRestaurants.Restaurant2;
        var r3 = SeedRestaurants.Restaurant3;
        var r4 = SeedRestaurants.Restaurant4;

        // Seed user for claim scenarios (so claimedByUserId references an existing user)
        if (!await db.Users.AnyAsync(cancellationToken))
        {
            db.Users.Add(new User
            {
                Id = SeedClaimerUserId,
                ExternalId = "seed-claimer",
                DisplayName = "Seed Claimer",
                Email = "seed@thatdish.local",
                CreatedAtUtc = now,
            });
        }

        var requestedAt = now.AddDays(-5);
        var reviewedAt = now.AddDays(-3);

        var restaurants = new[]
        {
            // Community, None – nunca reclamado
            new Restaurant
            {
                Id = r1.Id,
                Name = r1.Name,
                Address = "Rua das Flores 12, Lisboa",
                Latitude = 38.7112,
                Longitude = -9.1393,
                ContactInfo = "+351 21 123 4567",
                CreatedAtUtc = now,
                OwnershipType = OwnershipType.Community,
                ClaimStatus = ClaimStatus.None,
                ClaimedByUserId = null,
                ClaimRequestedAtUtc = null,
                ClaimReviewedAtUtc = null,
            },
            // Community, Pending – reclamação pendente
            new Restaurant
            {
                Id = r2.Id,
                Name = r2.Name,
                Address = "Rua de Santa Catarina 45, Porto",
                Latitude = 41.1579,
                Longitude = -8.6291,
                CreatedAtUtc = now,
                OwnershipType = OwnershipType.Community,
                ClaimStatus = ClaimStatus.Pending,
                ClaimedByUserId = SeedClaimerUserId,
                ClaimRequestedAtUtc = requestedAt,
                ClaimReviewedAtUtc = null,
            },
            // OwnerManaged, Verified – reclamação aprovada
            new Restaurant
            {
                Id = r3.Id,
                Name = r3.Name,
                Address = "Praça da República 3",
                Latitude = 40.2033,
                Longitude = -8.4103,
                ContactInfo = "bifanas@email.pt",
                CreatedAtUtc = now,
                OwnershipType = OwnershipType.OwnerManaged,
                ClaimStatus = ClaimStatus.Verified,
                ClaimedByUserId = SeedClaimerUserId,
                ClaimRequestedAtUtc = requestedAt,
                ClaimReviewedAtUtc = reviewedAt,
            },
            // Community, Rejected – reclamação rejeitada
            new Restaurant
            {
                Id = r4.Id,
                Name = r4.Name,
                Address = "Avenida da Liberdade 100, Lisboa",
                Latitude = 38.7223,
                Longitude = -9.1454,
                CreatedAtUtc = now,
                OwnershipType = OwnershipType.Community,
                ClaimStatus = ClaimStatus.Rejected,
                ClaimedByUserId = SeedClaimerUserId,
                ClaimRequestedAtUtc = requestedAt,
                ClaimReviewedAtUtc = reviewedAt,
            },
        };

        db.Restaurants.AddRange(restaurants);

        // Reuse exact image URLs from former frontend mock (Picsum, consistent per seed).
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
                Id = Guid.Parse("a0000001-0001-0001-0001-000000000001"),
                RestaurantId = r1.Id,
                Name = "Bacalhau à Brás",
                Description = "Bacalhau desfiado com batata palha, ovo e azeitonas. Clássico português.",
                ImageUrl = dishImageUrls[0],
                FoodType = FoodType.Traditional,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = DaysAgo(now, 30),
                UpdatedAtUtc = DaysAgo(now, 30),
            },
            new Dish
            {
                Id = Guid.Parse("a0000001-0001-0001-0001-000000000002"),
                RestaurantId = r1.Id,
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
                Id = Guid.Parse("a0000001-0001-0001-0001-000000000003"),
                RestaurantId = r1.Id,
                Name = "Pastel de Nata",
                Description = "Doce de nata com massa folhada, canela por cima.",
                ImageUrl = dishImageUrls[2],
                FoodType = FoodType.Dessert,
                IsMainDish = false,
                SortOrder = 2,
                CreatedAtUtc = DaysAgo(now, 30),
                UpdatedAtUtc = DaysAgo(now, 30),
            },
            new Dish
            {
                Id = Guid.Parse("b0000002-0002-0002-0002-000000000001"),
                RestaurantId = r2.Id,
                Name = "Arroz de Marisco",
                Description = "Arroz cremoso com mistura de marisco e cor de açafrão.",
                ImageUrl = dishImageUrls[3],
                FoodType = FoodType.Seafood,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = DaysAgo(now, 1),
                UpdatedAtUtc = DaysAgo(now, 1),
            },
            new Dish
            {
                Id = Guid.Parse("b0000002-0002-0002-0002-000000000002"),
                RestaurantId = r2.Id,
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
                Id = Guid.Parse("c0000003-0003-0003-0003-000000000001"),
                RestaurantId = r3.Id,
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
                Id = Guid.Parse("c0000003-0003-0003-0003-000000000002"),
                RestaurantId = r3.Id,
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
                Id = Guid.Parse("d0000004-0004-0004-0004-000000000001"),
                RestaurantId = r4.Id,
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
                Id = Guid.Parse("d0000004-0004-0004-0004-000000000002"),
                RestaurantId = r4.Id,
                Name = "Francesinha",
                Description = "Sanduíche com carnes, queijo, ovo e molho de cerveja.",
                ImageUrl = dishImageUrls[8],
                FoodType = FoodType.Sandwich,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = DaysAgo(now, 6),
                UpdatedAtUtc = DaysAgo(now, 6),
            },
            new Dish
            {
                Id = Guid.Parse("e0000005-0005-0005-0005-000000000001"),
                RestaurantId = r1.Id,
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
                Id = Guid.Parse("e0000005-0005-0005-0005-000000000002"),
                RestaurantId = r4.Id,
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
    }
}
