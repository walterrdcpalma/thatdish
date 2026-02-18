using Microsoft.EntityFrameworkCore;
using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;
using ThatDish.Domain.Seeding;

namespace ThatDish.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task SeedAsync(ThatDishDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Restaurants.AnyAsync(cancellationToken))
            return;

        var now = DateTime.UtcNow;
        var r1 = SeedRestaurants.Restaurant1;
        var r2 = SeedRestaurants.Restaurant2;
        var r3 = SeedRestaurants.Restaurant3;
        var r4 = SeedRestaurants.Restaurant4;

        var restaurants = new[]
        {
            new Restaurant
            {
                Id = r1.Id,
                Name = r1.Name,
                Address = "Rua das Flores 12, Lisboa",
                Latitude = 38.7112,
                Longitude = -9.1393,
                ContactInfo = "+351 21 123 4567",
                CreatedAtUtc = now,
            },
            new Restaurant
            {
                Id = r2.Id,
                Name = r2.Name,
                Address = "Rua de Santa Catarina 45, Porto",
                Latitude = 41.1579,
                Longitude = -8.6291,
                CreatedAtUtc = now,
            },
            new Restaurant
            {
                Id = r3.Id,
                Name = r3.Name,
                Address = "Praça da República 3",
                Latitude = 40.2033,
                Longitude = -8.4103,
                ContactInfo = "bifanas@email.pt",
                CreatedAtUtc = now,
            },
            new Restaurant
            {
                Id = r4.Id,
                Name = r4.Name,
                Address = "Avenida da Liberdade 100, Lisboa",
                Latitude = 38.7223,
                Longitude = -9.1454,
                CreatedAtUtc = now,
            },
        };

        db.Restaurants.AddRange(restaurants);

        // Reuse exact image URLs from former frontend mock (Picsum, consistent per seed).
        var dishImageUrls = new[]
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
