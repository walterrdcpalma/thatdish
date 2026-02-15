using System.Net;
using Xunit;

namespace ThatDish.Api.Tests;

public class HealthEndpointTests : IClassFixture<ThatDishApiFactory>
{
    private readonly HttpClient _client;

    public HealthEndpointTests(ThatDishApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await _client.GetAsync("/health");
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Health_ReturnsHealthy()
    {
        var response = await _client.GetAsync("/health");
        var text = await response.Content.ReadAsStringAsync();
        Assert.Equal("Healthy", text.Trim());
    }
}
