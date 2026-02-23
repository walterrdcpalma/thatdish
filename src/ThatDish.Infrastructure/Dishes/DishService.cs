using Microsoft.EntityFrameworkCore;
using ThatDish.Application.Cuisines;
using ThatDish.Application.DishCategories;
using ThatDish.Application.DishFamilies;
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
    private readonly IDishFamilyRepository _dishFamilyRepository;
    private readonly IDishCategoryRepository _dishCategoryRepository;
    private readonly ICuisineRepository _cuisineRepository;
    private readonly ThatDishDbContext _context;

    public DishService(
        IDishRepository dishRepository,
        IRestaurantRepository restaurantRepository,
        IDishFamilyRepository dishFamilyRepository,
        IDishCategoryRepository dishCategoryRepository,
        ICuisineRepository cuisineRepository,
        ThatDishDbContext context)
    {
        _dishRepository = dishRepository;
        _restaurantRepository = restaurantRepository;
        _dishFamilyRepository = dishFamilyRepository;
        _dishCategoryRepository = dishCategoryRepository;
        _cuisineRepository = cuisineRepository;
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
        var list = await _context.Dishes
            .AsNoTracking()
            .Include(d => d.Restaurant)
            .Include(d => d.DishCategory).ThenInclude(c => c!.DishFamily)
            .Include(d => d.SavedDishes).Include(d => d.Likes)
            .Where(d => EF.Functions.Like(d.Name, pattern) || EF.Functions.Like(d.Restaurant.Name, pattern))
            .OrderBy(d => d.Name)
            .Take(limit)
            .ToListAsync(cancellationToken);
        return list.Select(DishDtoMapping.ToDto).ToList();
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
        string dishFamilyName,
        string dishCategoryName,
        string foodType,
        string image,
        string? cuisineType,
        Guid? createdByUserId,
        CancellationToken cancellationToken = default)
    {
        var name = dishName.Trim();
        var restName = restaurantName.Trim();
        var familyName = dishFamilyName?.Trim() ?? string.Empty;
        var categoryName = dishCategoryName?.Trim() ?? string.Empty;
        var imageUrl = image?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(familyName))
            throw new InvalidOperationException("Dish family is required.");
        if (string.IsNullOrWhiteSpace(categoryName))
            throw new InvalidOperationException("Dish category is required.");

        var dishCategory = await GetOrCreateDishCategoryAsync(familyName, categoryName, cancellationToken);

        var restaurant = await _restaurantRepository.GetByNameAsync(restName, cancellationToken);
        if (restaurant == null)
        {
            if (string.IsNullOrWhiteSpace(cuisineType))
                throw new InvalidOperationException("cuisineType is required when creating a new restaurant.");
            var cuisine = await GetOrCreateCuisineAsync(cuisineType.Trim(), cancellationToken);
            restaurant = new Restaurant
            {
                Id = Guid.NewGuid(),
                Name = restName,
                Cuisine = cuisine.Name,
                CuisineId = cuisine.Id,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow,
                OwnershipType = OwnershipType.Community,
                ClaimStatus = ClaimStatus.None,
                ClaimedByUserId = null,
                ClaimRequestedAtUtc = null,
                ClaimReviewedAtUtc = null,
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
            DishCategoryId = dishCategory.Id,
            Name = name,
            ImageUrl = imageUrl,
            FoodType = foodTypeEnum,
            IsMainDish = false,
            SortOrder = 0,
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
            CreatedByUserId = createdByUserId,
        };
        _dishRepository.Add(dish);

        await _context.SaveChangesAsync(cancellationToken);

        var loaded = await _dishRepository.GetByIdAsync(dish.Id, cancellationToken);
        if (loaded == null)
            throw new InvalidOperationException("Dish was not found after save.");
        return loaded.ToDto();
    }

    private async Task<DishCategory> GetOrCreateDishCategoryAsync(string familyName, string categoryName, CancellationToken cancellationToken)
    {
        var family = await _dishFamilyRepository.GetByNameAsync(familyName, cancellationToken);
        if (family == null)
        {
            family = new DishFamily
            {
                Id = Guid.NewGuid(),
                Name = familyName,
                CreatedAtUtc = DateTime.UtcNow,
            };
            _dishFamilyRepository.Add(family);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var category = await _dishCategoryRepository.GetByFamilyAndNameAsync(family.Id, categoryName, cancellationToken);
        if (category == null)
        {
            category = new DishCategory
            {
                Id = Guid.NewGuid(),
                DishFamilyId = family.Id,
                Name = categoryName,
                CreatedAtUtc = DateTime.UtcNow,
            };
            _dishCategoryRepository.Add(category);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return category;
    }

    private async Task<Cuisine> GetOrCreateCuisineAsync(string name, CancellationToken cancellationToken)
    {
        var cuisine = await _cuisineRepository.GetByNameAsync(name, cancellationToken);
        if (cuisine == null)
        {
            cuisine = new Cuisine
            {
                Id = Guid.NewGuid(),
                Name = name,
                CreatedAtUtc = DateTime.UtcNow,
            };
            _cuisineRepository.Add(cuisine);
            await _context.SaveChangesAsync(cancellationToken);
        }
        return cuisine;
    }

    public async Task<List<DishDto>> GetMyContributionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var list = await _context.Dishes
            .AsNoTracking()
            .Include(d => d.Restaurant)
            .Include(d => d.DishCategory).ThenInclude(c => c!.DishFamily)
            .Include(d => d.SavedDishes).Include(d => d.Likes)
            .Where(d => d.CreatedByUserId == userId)
            .OrderByDescending(d => d.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        return list.Select(DishDtoMapping.ToDto).ToList();
    }
}
