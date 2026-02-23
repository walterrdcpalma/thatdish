namespace ThatDish.Domain.Seeding;

/// <summary>Fixed IDs aligned with the Supabase/Postgres seed script. Used for idempotent seed and static dish list.</summary>
public static class SeedIds
{
    // Users
    public static readonly Guid UserClaimer = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    public static readonly Guid User1 = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    public static readonly Guid User2 = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");
    public static readonly Guid User3 = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd");
    public static readonly Guid User4 = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee");
    public static readonly Guid User5 = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff");

    // Cuisines
    public static readonly Guid CuisinePortuguesa = Guid.Parse("c1000000-0000-0000-0000-000000000001");
    public static readonly Guid CuisineMarisqueira = Guid.Parse("c1000000-0000-0000-0000-000000000002");
    public static readonly Guid CuisineOther = Guid.Parse("c1000000-0000-0000-0000-000000000003");

    // DishFamilies
    public static readonly Guid FamilyBacalhau = Guid.Parse("f1000000-0000-0000-0000-000000000001");
    public static readonly Guid FamilySopas = Guid.Parse("f1000000-0000-0000-0000-000000000002");
    public static readonly Guid FamilySobremesas = Guid.Parse("f1000000-0000-0000-0000-000000000003");
    public static readonly Guid FamilyMarisco = Guid.Parse("f1000000-0000-0000-0000-000000000004");
    public static readonly Guid FamilySandes = Guid.Parse("f1000000-0000-0000-0000-000000000005");
    public static readonly Guid FamilyArrozes = Guid.Parse("f1000000-0000-0000-0000-000000000006");
    public static readonly Guid FamilyVegetarianoVegan = Guid.Parse("f1000000-0000-0000-0000-000000000007");

    // DishCategories (Id from script)
    public static readonly Guid CatBacalhauBras = Guid.Parse("dc000001-0000-0000-0000-000000000001");
    public static readonly Guid CatCaldoVerde = Guid.Parse("dc000001-0000-0000-0000-000000000002");
    public static readonly Guid CatPastelNata = Guid.Parse("dc000001-0000-0000-0000-000000000003");
    public static readonly Guid CatArrozMarisco = Guid.Parse("dc000001-0000-0000-0000-000000000004");
    public static readonly Guid CatCataplanaAmeijoas = Guid.Parse("dc000001-0000-0000-0000-000000000005");
    public static readonly Guid CatBifanaPao = Guid.Parse("dc000001-0000-0000-0000-000000000006");
    public static readonly Guid CatPregoPao = Guid.Parse("dc000001-0000-0000-0000-000000000007");
    public static readonly Guid CatArrozPato = Guid.Parse("dc000001-0000-0000-0000-000000000008");
    public static readonly Guid CatFrancesinha = Guid.Parse("dc000001-0000-0000-0000-000000000009");
    public static readonly Guid CatBowlQuinoa = Guid.Parse("dc000001-0000-0000-0000-000000000010");
    public static readonly Guid CatCremeLegumesVegan = Guid.Parse("dc000001-0000-0000-0000-000000000011");

    // Restaurants (from SeedRestaurants)
    public static readonly Guid Rest1 = Guid.Parse("11111111-1111-1111-1111-111111111101");
    public static readonly Guid Rest2 = Guid.Parse("22222222-2222-2222-2222-222222222202");
    public static readonly Guid Rest3 = Guid.Parse("33333333-3333-3333-3333-333333333303");
    public static readonly Guid Rest4 = Guid.Parse("44444444-4444-4444-4444-444444444404");

    // Dishes
    public static readonly Guid DishBacalhauBras = Guid.Parse("a0000001-0001-0001-0001-000000000001");
    public static readonly Guid DishCaldoVerde = Guid.Parse("a0000001-0001-0001-0001-000000000002");
    public static readonly Guid DishPastelNata = Guid.Parse("a0000001-0001-0001-0001-000000000003");
    public static readonly Guid DishArrozMarisco = Guid.Parse("b0000002-0002-0002-0002-000000000001");
    public static readonly Guid DishCataplanaAmeijoas = Guid.Parse("b0000002-0002-0002-0002-000000000002");
    public static readonly Guid DishBifanaPao = Guid.Parse("c0000003-0003-0003-0003-000000000001");
    public static readonly Guid DishPregoPao = Guid.Parse("c0000003-0003-0003-0003-000000000002");
    public static readonly Guid DishArrozPato = Guid.Parse("d0000004-0004-0004-0004-000000000001");
    public static readonly Guid DishFrancesinha = Guid.Parse("d0000004-0004-0004-0004-000000000002");
    public static readonly Guid DishBowlQuinoa = Guid.Parse("e0000005-0005-0005-0005-000000000001");
    public static readonly Guid DishCremeLegumesVegan = Guid.Parse("e0000005-0005-0005-0005-000000000002");

    // Likes & Ratings
    public static readonly Guid Like1 = Guid.Parse("90000000-0000-0000-0000-000000000001");
    public static readonly Guid Like2 = Guid.Parse("90000000-0000-0000-0000-000000000002");
    public static readonly Guid Like3 = Guid.Parse("90000000-0000-0000-0000-000000000003");
    public static readonly Guid Like4 = Guid.Parse("90000000-0000-0000-0000-000000000004");
    public static readonly Guid Rating1 = Guid.Parse("91000000-0000-0000-0000-000000000001");
    public static readonly Guid Rating2 = Guid.Parse("91000000-0000-0000-0000-000000000002");
    public static readonly Guid Rating3 = Guid.Parse("91000000-0000-0000-0000-000000000003");
    public static readonly Guid Rating4 = Guid.Parse("91000000-0000-0000-0000-000000000004");
}
