import type { Dish } from "../types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysSince(createdAt: string, now: Date): number {
  const created = new Date(createdAt).getTime();
  return (now.getTime() - created) / MS_PER_DAY;
}

/** Recency boost for trending: date-weighted. Last 3 days +10, last 7 days +4, else 0. */
function getTrendingRecencyBoost(createdAt: string, now: Date): number {
  const days = daysSince(createdAt, now);
  if (days <= 3) return 10;
  if (days <= 7) return 4;
  return 0;
}

/**
 * Trending score: date-heavy so recent dishes rank higher.
 * trendingScore = recencyBoost * 2 + savedCount (recencyBoost is 10 or 4 or 0).
 */
function getTrendingScore(dish: Dish, now: Date): number {
  const boost = getTrendingRecencyBoost(dish.createdAt, now);
  return boost * 2 + (dish.savedCount ?? 0);
}

/** Top 5 by trending score (date-heavy), among non-archived, created within 7 days. */
function getTop5Trending(allDishes: Dish[], now: Date): Dish[] {
  const active = allDishes
    .filter((d) => !d.isArchived && daysSince(d.createdAt, now) <= 7);
  return [...active].sort(
    (a, b) => getTrendingScore(b, now) - getTrendingScore(a, now)
  ).slice(0, 5);
}

export interface DishBadges {
  isTrending: boolean;
  isTop: boolean;
  isNew: boolean;
}

/**
 * Pure classification. Badges are hierarchical: Top > Trending > New (only one shown in UI).
 * - New: only date — created within last 7 days
 * - Top: in top 3 by saved count (among non-archived)
 * - Trending: in top 5 by date-heavy trending score AND created within last 7 days
 */
export function getDishBadges(dish: Dish, allDishes: Dish[]): DishBadges {
  const now = new Date();
  const active = allDishes.filter((d) => !d.isArchived);
  const days = daysSince(dish.createdAt, now);

  const isNew = days <= 7;

  const top3BySaves = [...active]
    .sort((a, b) => b.savedCount - a.savedCount)
    .slice(0, 3);
  const isTop = top3BySaves.some((d) => d.id === dish.id);

  const top5Trending = getTop5Trending(allDishes, now);
  const isTrending = days <= 7 && top5Trending.some((d) => d.id === dish.id);

  return { isTrending, isTop, isNew };
}

/** At most one badge per item. Priority: TOP > TRENDING > NEW. */
export type PrimaryBadge = "top" | "trending" | "new";

export function getPrimaryBadge(dish: Dish, allDishes: Dish[]): PrimaryBadge | null {
  const badges = getDishBadges(dish, allDishes);
  if (badges.isTop) return "top";
  if (badges.isTrending) return "trending";
  if (badges.isNew) return "new";
  return null;
}
