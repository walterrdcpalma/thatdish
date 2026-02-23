export interface DishFamilyItemDto {
  id: string;
  name: string;
}

export async function fetchDishFamilies(
  baseUrl: string,
  search: string
): Promise<DishFamilyItemDto[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/dish-families?search=${encodeURIComponent(search)}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) return [];
  return raw.map((item: { id?: string; name?: string }) => ({
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
  }));
}
