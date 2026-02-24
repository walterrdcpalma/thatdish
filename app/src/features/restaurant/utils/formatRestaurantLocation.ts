/**
 * Builds a single display string for restaurant location.
 * Priority: Address > "City, Country" > City > Country.
 * Returns null when no location fields are present.
 */
export function formatRestaurantLocation(restaurant: {
  address?: string | null;
  city?: string | null;
  country?: string | null;
}): string | null {
  const address = restaurant.address?.trim();
  const city = restaurant.city?.trim();
  const country = restaurant.country?.trim();

  if (address) return address;
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return null;
}
