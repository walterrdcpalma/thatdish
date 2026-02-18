using ThatDish.Domain.Entities;

namespace ThatDish.Application.Restaurants;

public static class RestaurantDtoMapping
{
    public static RestaurantDto ToDto(this Restaurant r)
    {
        return new RestaurantDto(
            Id: r.Id,
            Name: r.Name,
            Address: r.Address,
            Latitude: r.Latitude,
            Longitude: r.Longitude,
            ContactInfo: r.ContactInfo,
            CreatedAtUtc: r.CreatedAtUtc,
            UpdatedAtUtc: r.UpdatedAtUtc
        );
    }
}
