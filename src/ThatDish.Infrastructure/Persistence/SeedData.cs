using Microsoft.EntityFrameworkCore;
using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;

namespace ThatDish.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task SeedAsync(ThatDishDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Restaurants.AnyAsync(cancellationToken))
            return;

        var now = DateTime.UtcNow;

        var restaurant1Id = Guid.Parse("11111111-1111-1111-1111-111111111101");
        var restaurant2Id = Guid.Parse("22222222-2222-2222-2222-222222222202");
        var restaurant3Id = Guid.Parse("33333333-3333-3333-3333-333333333303");
        var restaurant4Id = Guid.Parse("44444444-4444-4444-4444-444444444404");

        var restaurants = new[]
        {
            new Restaurant
            {
                Id = restaurant1Id,
                Name = "Tasca do Zé",
                Address = "Rua das Flores 12, Lisboa",
                Latitude = 38.7112,
                Longitude = -9.1393,
                ContactInfo = "+351 21 123 4567",
                CreatedAtUtc = now,
            },
            new Restaurant
            {
                Id = restaurant2Id,
                Name = "Marisqueira do Porto",
                Address = "Rua de Santa Catarina 45, Porto",
                Latitude = 41.1579,
                Longitude = -8.6291,
                CreatedAtUtc = now,
            },
            new Restaurant
            {
                Id = restaurant3Id,
                Name = "Bifanas da Praça",
                Address = "Praça da República 3",
                Latitude = 40.2033,
                Longitude = -8.4103,
                ContactInfo = "bifanas@email.pt",
                CreatedAtUtc = now,
            },
            new Restaurant
            {
                Id = restaurant4Id,
                Name = "Casa do Arroz",
                Address = "Avenida da Liberdade 100, Lisboa",
                Latitude = 38.7223,
                Longitude = -9.1454,
                CreatedAtUtc = now,
            },
        };

        db.Restaurants.AddRange(restaurants);

        var dishes = new[]
        {
            new Dish
            {
                Id = Guid.Parse("a0000001-0001-0001-0001-000000000001"),
                RestaurantId = restaurant1Id,
                Name = "Bacalhau à Brás",
                Description = "Bacalhau desfiado com batata palha, ovo e azeitonas. Clássico português.",
                ImageUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
                FoodType = FoodType.Traditional,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("a0000001-0001-0001-0001-000000000002"),
                RestaurantId = restaurant1Id,
                Name = "Caldo Verde",
                Description = "Sopa de couve-galega com chouriço e batata.",
                ImageUrl = "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
                FoodType = FoodType.Soup,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("a0000001-0001-0001-0001-000000000003"),
                RestaurantId = restaurant1Id,
                Name = "Pastel de Nata",
                Description = "Doce de nata com massa folhada, canela por cima.",
                ImageUrl = "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
                FoodType = FoodType.Dessert,
                IsMainDish = false,
                SortOrder = 2,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("b0000002-0002-0002-0002-000000000001"),
                RestaurantId = restaurant2Id,
                Name = "Arroz de Marisco",
                Description = "Arroz cremoso com mistura de marisco e cor de açafrão.",
                ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
                FoodType = FoodType.Seafood,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("b0000002-0002-0002-0002-000000000002"),
                RestaurantId = restaurant2Id,
                Name = "Cataplana de Amêijoas",
                Description = "Amêijoas à bulhão pato na cataplana.",
                ImageUrl = "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
                FoodType = FoodType.Seafood,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("c0000003-0003-0003-0003-000000000001"),
                RestaurantId = restaurant3Id,
                Name = "Bifana no Pão",
                Description = "Carne de porco marinada, grelhada, no pão com mostarda.",
                ImageUrl = "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
                FoodType = FoodType.StreetFood,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("c0000003-0003-0003-0003-000000000002"),
                RestaurantId = restaurant3Id,
                Name = "Prego no Pão",
                Description = "Bife de vaca grelhado no pão com manteiga de alho.",
                ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
                FoodType = FoodType.StreetFood,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("d0000004-0004-0004-0004-000000000001"),
                RestaurantId = restaurant4Id,
                Name = "Arroz de Pato",
                Description = "Arroz de pato confitado com chouriço e grelos.",
                ImageUrl = "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
                FoodType = FoodType.Rice,
                IsMainDish = true,
                SortOrder = 0,
                CreatedAtUtc = now,
            },
            new Dish
            {
                Id = Guid.Parse("d0000004-0004-0004-0004-000000000002"),
                RestaurantId = restaurant4Id,
                Name = "Francesinha",
                Description = "Sanduíche com carnes, queijo, ovo e molho de cerveja.",
                ImageUrl = "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=800",
                FoodType = FoodType.Sandwich,
                IsMainDish = false,
                SortOrder = 1,
                CreatedAtUtc = now,
            },
        };

        db.Dishes.AddRange(dishes);
        await db.SaveChangesAsync(cancellationToken);
    }
}
