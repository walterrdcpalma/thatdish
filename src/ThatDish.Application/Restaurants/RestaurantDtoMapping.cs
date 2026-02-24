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
            City: r.City,
            Country: r.Country,
            Latitude: r.Latitude,
            Longitude: r.Longitude,
            ContactInfo: r.ContactInfo,
            CreatedAtUtc: r.CreatedAtUtc,
            UpdatedAtUtc: r.UpdatedAtUtc,
            OwnershipType: r.OwnershipType,
            ClaimStatus: r.ClaimStatus,
            ClaimedByUserId: r.ClaimedByUserId,
            ClaimRequestedAtUtc: r.ClaimRequestedAtUtc,
            ClaimReviewedAtUtc: r.ClaimReviewedAtUtc
        );
    }
}
