export interface CuisineItemDto {
  id: string;
  name: string;
}

export async function fetchCuisines(baseUrl: string, search: string): Promise<CuisineItemDto[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/cuisines?search=${encodeURIComponent(search)}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) return [];
  return raw.map((item: { id?: string; name?: string }) => ({
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
  }));
}
