using Microsoft.EntityFrameworkCore;
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

    public async Task<List<DishDto>> SearchDishesAsync(string query, int limit, CancellationToken cancellationToken = default)
    {
        var term = (query ?? string.Empty).Trim();
        if (string.IsNullOrEmpty(term))
            return new List<DishDto>();

        var pattern = $"%{term}%";
        var projected = await _context.Dishes
            .AsNoTracking()
            .Where(d => EF.Functions.Like(d.Name, pattern) || EF.Functions.Like(d.Restaurant.Name, pattern))
            .OrderBy(d => d.Name)
            .Take(limit)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.RestaurantId,
                RestaurantName = d.Restaurant.Name,
                d.ImageUrl,
                d.FoodType,
                d.CreatedAtUtc,
                d.UpdatedAtUtc
            })
            .ToListAsync(cancellationToken);

        return projected
            .Select(p => new DishDto(
                p.Id,
                p.Name,
                p.RestaurantId,
                p.RestaurantName,
                p.ImageUrl,
                p.FoodType.ToString(),
                0,
                Array.Empty<string>(),
                p.CreatedAtUtc,
                p.UpdatedAtUtc,
                string.Empty,
                null,
                false))
            .ToList();
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
