import type { Dish } from "../types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysSince(createdAt: string, now: Date): number {
  const created = new Date(createdAt).getTime();
  return (now.getTime() - created) / MS_PER_DAY;
}

function getRecencyBoost(createdAt: string, now: Date): number {
  const days = daysSince(createdAt, now);
  if (days <= 3) return 5;
  if (days <= 7) return 2;
  return 0;
}

/**
 * Computes a dynamic score for ranking. Not stored on the dish.
 * score = (savedByUserIds.length * 2) + recencyBoost
 * Recency: last 3 days +5, last 7 days +2, otherwise 0.
 */
function computeScore(dish: Dish, now: Date): number {
  const savePart = (dish.savedByUserIds?.length ?? 0) * 2;
  const recencyBoost = getRecencyBoost(dish.createdAt, now);
  return savePart + recencyBoost;
}

/**
 * Returns non-archived dishes sorted by smart score descending.
 * Does not mutate dishes or store score on the dish.
 */
export function getRankedDishes(dishes: Dish[]): Dish[] {
  const now = new Date();
  const active = dishes.filter((d) => !d.isArchived);
  return [...active].sort((a, b) => computeScore(b, now) - computeScore(a, now));
}
