using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using ThatDish.Application.Dishes;
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
        var dishes = await response.Content.ReadFromJsonAsync<List<DishDto>>();
        Assert.NotNull(dishes);
        Assert.True(dishes.Count >= 1, "Seed data should have at least one dish.");
    }

    [Fact]
    public async Task Get_ReturnsJsonMatchingFrontendShape()
    {
        var response = await _client.GetAsync("/api/dishes");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        Assert.Equal(JsonValueKind.Array, root.ValueKind);
        if (root.GetArrayLength() == 0) return;
        var first = root[0];
        Assert.True(first.TryGetProperty("id", out _), "Expected camelCase 'id'");
        Assert.True(first.TryGetProperty("name", out _), "Expected camelCase 'name'");
        Assert.True(first.TryGetProperty("restaurantId", out _), "Expected camelCase 'restaurantId'");
        Assert.True(first.TryGetProperty("restaurantName", out _), "Expected camelCase 'restaurantName'");
        Assert.True(first.TryGetProperty("savedCount", out _), "Expected camelCase 'savedCount'");
        Assert.True(first.TryGetProperty("savedByUserIds", out _), "Expected camelCase 'savedByUserIds'");
        Assert.True(first.TryGetProperty("createdAt", out _), "Expected camelCase 'createdAt'");
        Assert.True(first.TryGetProperty("updatedAt", out _), "Expected camelCase 'updatedAt'");
        Assert.True(first.TryGetProperty("createdByUserId", out _), "Expected camelCase 'createdByUserId'");
        Assert.True(first.TryGetProperty("isArchived", out _), "Expected camelCase 'isArchived'");
        Assert.True(first.TryGetProperty("foodType", out _), "Expected camelCase 'foodType'");
        Assert.True(first.TryGetProperty("image", out _), "Expected camelCase 'image'");
        Assert.True(first.TryGetProperty("dishCategoryId", out _), "Expected camelCase 'dishCategoryId'");
        Assert.True(first.TryGetProperty("dishCategoryName", out _), "Expected camelCase 'dishCategoryName'");
        Assert.True(first.TryGetProperty("dishFamilyName", out _), "Expected camelCase 'dishFamilyName'");
        Assert.False(first.TryGetProperty("imagePlaceholder", out _), "Must not have imagePlaceholder");
    }
}
