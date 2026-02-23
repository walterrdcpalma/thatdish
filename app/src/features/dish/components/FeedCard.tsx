import { memo } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { FeedDishItem } from "../types";
import type { PrimaryBadge } from "../utils/getDishBadges";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { AnimatedPressable } from "@/src/shared/components";
import { config } from "@/src/config";

function getImageUri(image: string): string {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const base = config.apiBaseUrl.replace(/\/$/, "");
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
}

const IMAGE_ASPECT_RATIO = 5 / 4; // height / width → 4:5

export interface FeedCardProps {
  item: FeedDishItem;
  /** Called when user taps the restaurant name; opens restaurant detail. */
  onPressRestaurant: (restaurantId: string) => void;
  width: number;
  primaryBadge?: PrimaryBadge | null;
  isSaved: boolean;
  isLiked: boolean;
}

const BADGE_LABELS: Record<PrimaryBadge, string> = {
  top: "TOP",
  trending: "TRENDING",
  new: "NEW",
};

function feedCardPropsAreEqual(prev: FeedCardProps, next: FeedCardProps): boolean {
  const a = prev.item;
  const b = next.item;
  return (
    prev.width === next.width &&
    prev.primaryBadge === next.primaryBadge &&
    prev.isSaved === next.isSaved &&
    prev.isLiked === next.isLiked &&
    a.id === b.id &&
    a.name === b.name &&
    a.image === b.image &&
    (a.restaurantName ?? "") === (b.restaurantName ?? "") &&
    a.restaurantId === b.restaurantId &&
    (a.likesCount ?? 0) === (b.likesCount ?? 0) &&
    (a.savesCount ?? 0) === (b.savesCount ?? 0)
  );
}

function FeedCardInner({
  item,
  onPressRestaurant,
  width,
  primaryBadge = null,
  isSaved,
  isLiked,
}: FeedCardProps) {
  const toggleSave = useDishStore((s) => s.toggleSave);
  const toggleLike = useDishStore((s) => s.toggleLike);
  const restaurantNameFromStore = useRestaurantStore((s) =>
    s.restaurants.find((r) => r.id === item.restaurantId)?.name
  );
  const restaurantName =
    item.restaurantName ?? restaurantNameFromStore ?? "Unknown";
  const likeCount = item.likesCount ?? 0;

  const handleSave = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    toggleSave(item.id);
  };

  const handleLike = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    toggleLike(item.id);
  };

  const handlePressRestaurantName = () => {
    if (!item.restaurantId?.trim()) {
      if (__DEV__) {
        console.warn("[Discover] Missing restaurantId, skipping navigation.");
      }
      return;
    }
    onPressRestaurant(item.restaurantId);
  };

  const imageUri = getImageUri(item.image);
  const imageHeight = width * IMAGE_ASPECT_RATIO;

  return (
    <View style={styles.post}>
      {/* Image full-width, overlay top-left: restaurant name (tappable, navigates to restaurant) */}
      <View style={[styles.imageWrap, { width, height: imageHeight }]}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { width, height: imageHeight }]}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={styles.restaurantOverlay}>
          <Pressable
            onPress={handlePressRestaurantName}
            accessibilityRole="button"
            accessibilityLabel={`Open restaurant ${restaurantName}`}
            style={styles.restaurantNameTouchable}
          >
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurantName}
            </Text>
          </Pressable>
        </View>
        {primaryBadge != null && (
          <View
            style={
              primaryBadge === "top"
                ? styles.badgePillTop
                : primaryBadge === "trending"
                  ? styles.badgePillTrending
                  : styles.badgePillNew
            }
          >
            <Text style={styles.badgeText}>{BADGE_LABELS[primaryBadge]}</Text>
          </View>
        )}
      </View>
      {/* Actions + caption (white area, no card look) */}
      <View style={styles.footer}>
        <View style={styles.actionsRow}>
          <AnimatedPressable
            onPress={handleLike}
            scale={0.92}
            style={styles.actionBtn}
            hitSlop={8}
          >
            <View style={styles.actionBtnContent}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#ef4444" : "#262626"}
              />
              <Text style={styles.actionCount}>{likeCount}</Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={handleSave}
            scale={0.92}
            style={styles.actionBtn}
            hitSlop={8}
          >
            <View style={styles.actionBtnContent}>
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color="#262626"
              />
              <Text style={styles.actionCount}>{item.savesCount ?? 0}</Text>
            </View>
          </AnimatedPressable>
        </View>
        <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
      </View>
    </View>
  );
}

export const FeedCard = memo(FeedCardInner, feedCardPropsAreEqual);

const styles = StyleSheet.create({
  post: {
    backgroundColor: "#fff",
    marginBottom: 1,
    overflow: "hidden",
  },
  imageWrap: {
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  image: {
    backgroundColor: "#e5e7eb",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  restaurantOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 48,
  },
  restaurantNameTouchable: {
    alignSelf: "flex-start",
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgePill: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillTop: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#d97706",
  },
  badgePillTrending: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#ea580c",
  },
  badgePillNew: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#0d9488",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  footer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#fff",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#262626",
  },
  caption: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
});
