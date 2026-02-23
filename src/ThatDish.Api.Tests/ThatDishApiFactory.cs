using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace ThatDish.Api.Tests;

public class ThatDishApiFactory : WebApplicationFactory<Program>
{
    private readonly string _testDbPath;

    public ThatDishApiFactory()
    {
        _testDbPath = Path.Combine(Path.GetTempPath(), $"thatdish_test_{Guid.NewGuid():N}.db");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment(Environments.Development);
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = $"Data Source={_testDbPath}"
            });
        });
    }
}
