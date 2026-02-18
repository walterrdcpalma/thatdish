using ThatDish.Application.Dishes;
using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;
using NSubstitute;
using Xunit;

namespace ThatDish.Application.Tests;

public class DishListServiceTests
{
    private readonly IDishRepository _repo;
    private readonly DishListService _sut;

    public DishListServiceTests()
    {
        _repo = Substitute.For<IDishRepository>();
        _sut = new DishListService(_repo);
    }

    [Fact]
    public async Task GetPagedAsync_CallsRepository_WithQueryParams()
    {
        _repo.GetPagedAsync(Arg.Any<FoodType?>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(new List<Dish>());

        await _sut.GetPagedAsync(new ListDishesQuery(null, 2, 10));

        await _repo.Received(1).GetPagedAsync(null, 2, 10, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetPagedAsync_WithFoodType_PassesFilterToRepository()
    {
        _repo.GetPagedAsync(Arg.Any<FoodType?>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(new List<Dish>());

        await _sut.GetPagedAsync(new ListDishesQuery(FoodType.Seafood, 1, 20));

        await _repo.Received(1).GetPagedAsync(FoodType.Seafood, 1, 20, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetPagedAsync_MapsDishesToDtos()
    {
        var restaurant = new Restaurant { Id = Guid.NewGuid(), Name = "Test Restaurant" };
        var dish = new Dish
        {
            Id = Guid.NewGuid(),
            Name = "Test Dish",
            Description = "Desc",
            ImageUrl = "https://example.com/img.jpg",
            FoodType = FoodType.Pasta,
            IsMainDish = true,
            RestaurantId = restaurant.Id,
            Restaurant = restaurant
        };
        _repo.GetPagedAsync(Arg.Any<FoodType?>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(new List<Dish> { dish });

        var result = await _sut.GetPagedAsync(new ListDishesQuery(null, 1, 20));

        Assert.Single(result);
        Assert.Equal(dish.Id, result[0].Id);
        Assert.Equal("Test Dish", result[0].Name);
        Assert.Equal("Desc", result[0].Description);
        Assert.Equal("https://example.com/img.jpg", result[0].ImageUrl);
        Assert.Equal(FoodType.Pasta, result[0].FoodType);
        Assert.True(result[0].IsMainDish);
        Assert.Equal("Test Restaurant", result[0].RestaurantName);
        Assert.Equal(restaurant.Id, result[0].RestaurantId);
    }

    [Fact]
    public async Task GetPagedAsync_ReturnsEmptyList_WhenRepositoryReturnsEmpty()
    {
        _repo.GetPagedAsync(Arg.Any<FoodType?>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(new List<Dish>());

        var result = await _sut.GetPagedAsync(new ListDishesQuery(null, 1, 20));

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetDishesAsync_ReturnsDtosMappedFromDomain()
    {
        var dish = new Dish
        {
            Id = Guid.NewGuid(),
            Name = "Fish and Chips",
            RestaurantId = Guid.NewGuid(),
            ImageUrl = "https://example.com/fish.jpg",
            CreatedAtUtc = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAtUtc = null
        };
        _repo.GetAllAsync(Arg.Any<CancellationToken>()).Returns(new List<Dish> { dish });

        var result = await _sut.GetDishesAsync();

        Assert.Single(result);
        Assert.Equal(dish.Id, result[0].Id);
        Assert.Equal("Fish and Chips", result[0].Name);
        Assert.Equal(dish.RestaurantId, result[0].RestaurantId);
        Assert.Equal("https://example.com/fish.jpg", result[0].ImagePlaceholder);
        Assert.Equal(0, result[0].SavedCount);
        Assert.Empty(result[0].SavedByUserIds);
        Assert.Equal(dish.CreatedAtUtc, result[0].CreatedAt);
        Assert.Null(result[0].UpdatedAt);
        Assert.False(result[0].IsArchived);
    }
}
