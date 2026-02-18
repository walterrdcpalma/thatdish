namespace ThatDish.Domain.Seeding;

/// <summary>
/// Single source of truth for seed restaurant IDs and names. Used by SeedData (Infrastructure) and StaticDishSeed (Application).
/// </summary>
public static class SeedRestaurants
{
    public static readonly (Guid Id, string Name) Restaurant1 = (Guid.Parse("11111111-1111-1111-1111-111111111101"), "Tasca do Zé");
    public static readonly (Guid Id, string Name) Restaurant2 = (Guid.Parse("22222222-2222-2222-2222-222222222202"), "Marisqueira do Porto");
    public static readonly (Guid Id, string Name) Restaurant3 = (Guid.Parse("33333333-3333-3333-3333-333333333303"), "Bifanas da Praça");
    public static readonly (Guid Id, string Name) Restaurant4 = (Guid.Parse("44444444-4444-4444-4444-444444444404"), "Casa do Arroz");
}
