using ThatDish.Application.Dishes;
using ThatDish.Application.Restaurants;
using ThatDish.Domain.Entities;
using ThatDish.Domain.Enums;
using ThatDish.Infrastructure.Persistence;

namespace ThatDish.Infrastructure.Dishes;

public class DishService : IDishService
{
    private readonly IDishRepository _dishRepository;
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly ThatDishDbContext _context;

    public DishService(
        IDishRepository dishRepository,
        IRestaurantRepository restaurantRepository,
        ThatDishDbContext context)
    {
        _dishRepository = dishRepository;
        _restaurantRepository = restaurantRepository;
        _context = context;
    }

    public async Task<List<DishDto>> GetDishesAsync(CancellationToken cancellationToken = default)
    {
        var dishes = await _dishRepository.GetAllAsync(cancellationToken);
        return dishes.Select(DishDtoMapping.ToDto).ToList();
    }

    public async Task<List<DishListDto>> GetPagedAsync(ListDishesQuery query, CancellationToken cancellationToken = default)
    {
        var dishes = await _dishRepository.GetPagedAsync(
            query.FoodType,
            query.Page,
            query.PageSize,
            cancellationToken);
        return dishes
            .Select(d => new DishListDto(
                d.Id,
                d.Name,
                d.Description,
                d.ImageUrl,
                d.FoodType,
                d.IsMainDish,
                d.Restaurant.Name,
                d.RestaurantId))
            .ToList();
    }

    public async Task<DishDto> CreateDishAsync(
        string dishName,
        string restaurantName,
        string foodType,
        string image,
        CancellationToken cancellationToken = default)
    {
        var name = dishName.Trim();
        var restName = restaurantName.Trim();
        var imageUrl = image?.Trim() ?? string.Empty;

        var restaurant = await _restaurantRepository.GetByNameAsync(restName, cancellationToken);
        if (restaurant == null)
        {
            restaurant = new Restaurant
            {
                Id = Guid.NewGuid(),
                Name = restName,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow
            };
            _restaurantRepository.Add(restaurant);
        }

        var exists = await _dishRepository.ExistsAsync(restaurant.Id, name, cancellationToken);
        if (exists)
            throw new InvalidOperationException("A dish with this name already exists for this restaurant.");

        var foodTypeEnum = Enum.TryParse<FoodType>(foodType, ignoreCase: true, out var ft) ? ft : FoodType.Other;
        var now = DateTime.UtcNow;
        var dish = new Dish
        {
            Id = Guid.NewGuid(),
            RestaurantId = restaurant.Id,
            Name = name,
            ImageUrl = imageUrl,
            FoodType = foodTypeEnum,
            IsMainDish = false,
            SortOrder = 0,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };
        _dishRepository.Add(dish);

        await _context.SaveChangesAsync(cancellationToken);

        var loaded = await _dishRepository.GetByIdAsync(dish.Id, cancellationToken);
        if (loaded == null)
            throw new InvalidOperationException("Dish was not found after save.");
        return loaded.ToDto();
    }
}
