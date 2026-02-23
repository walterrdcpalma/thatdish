export interface DishCategoryItemDto {
  id: string;
  name: string;
  dishFamilyId: string;
}

export async function fetchDishCategories(
  baseUrl: string,
  familyId: string,
  search: string
): Promise<DishCategoryItemDto[]> {
  if (!familyId) return [];
  const url = `${baseUrl.replace(/\/$/, "")}/api/dish-categories?familyId=${encodeURIComponent(familyId)}&search=${encodeURIComponent(search)}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) return [];
  return raw.map((item: { id?: string; name?: string; dishFamilyId?: string }) => ({
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
    dishFamilyId: String(item.dishFamilyId ?? ""),
  }));
}
