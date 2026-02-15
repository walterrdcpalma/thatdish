using System.Net;
using System.Net.Http.Json;
using ThatDish.Application.Dishes;
using ThatDish.Domain.Enums;
using Xunit;

namespace ThatDish.Api.Tests;

public class DishesControllerTests : IClassFixture<ThatDishApiFactory>
{
    private readonly HttpClient _client;

    public DishesControllerTests(ThatDishApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Get_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/dishes");
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Get_ReturnsJsonArray()
    {
        var response = await _client.GetAsync("/api/dishes");
        response.EnsureSuccessStatusCode();
        var dishes = await response.Content.ReadFromJsonAsync<List<DishListDto>>();
        Assert.NotNull(dishes);
        Assert.True(dishes.Count >= 1, "Seed data should have at least one dish.");
    }

    [Fact]
    public async Task Get_WithFoodType_ReturnsFiltered()
    {
        var response = await _client.GetAsync("/api/dishes?foodType=Seafood");
        response.EnsureSuccessStatusCode();
        var dishes = await response.Content.ReadFromJsonAsync<List<DishListDto>>();
        Assert.NotNull(dishes);
        Assert.All(dishes, d => Assert.Equal(FoodType.Seafood, d.FoodType));
    }

    [Fact]
    public async Task Get_WithPageAndPageSize_RespectsPagination()
    {
        var response = await _client.GetAsync("/api/dishes?page=1&pageSize=2");
        response.EnsureSuccessStatusCode();
        var dishes = await response.Content.ReadFromJsonAsync<List<DishListDto>>();
        Assert.NotNull(dishes);
        Assert.True(dishes.Count <= 2);
    }
}
