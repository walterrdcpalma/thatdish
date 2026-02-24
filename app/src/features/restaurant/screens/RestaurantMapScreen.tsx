import { useCallback } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";
import { openDirections, isLatLngValid } from "@/src/shared/utils/openDirections";

const DEFAULT_DELTA = 0.01;

export function RestaurantMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    lat: string;
    lng: string;
    name?: string;
    locationLabel?: string;
  }>();

  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
  const latParam = typeof params.lat === "string" ? params.lat : Array.isArray(params.lat) ? params.lat[0] : undefined;
  const lngParam = typeof params.lng === "string" ? params.lng : Array.isArray(params.lng) ? params.lng[0] : undefined;
  const name = typeof params.name === "string" ? params.name : Array.isArray(params.name) ? params.name[0] : "";
  const locationLabel = typeof params.locationLabel === "string" ? params.locationLabel : Array.isArray(params.locationLabel) ? params.locationLabel[0] : "";

  const lat = latParam != null ? parseFloat(latParam) : NaN;
  const lng = lngParam != null ? parseFloat(lngParam) : NaN;
  const valid = isLatLngValid(lat, lng);

  const initialRegion = valid
    ? {
        latitude: lat,
        longitude: lng,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
      }
    : {
        latitude: 38.7223,
        longitude: -9.1393,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  const handleGoThere = useCallback(() => {
    if (!valid) return;
    openDirections(lat, lng, locationLabel || name || undefined);
  }, [valid, lat, lng, locationLabel, name]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <AnimatedPressable
          onPress={() => router.back()}
          scale={0.98}
          style={styles.backRow}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </AnimatedPressable>
      </View>
      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          {valid && (
            <Marker
              coordinate={{ latitude: lat, longitude: lng }}
              title={name || "Restaurant"}
              description={locationLabel || undefined}
              pinColor="#f97316"
            />
          )}
        </MapView>
      </View>
      <View style={styles.info}>
        {name ? (
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
        ) : null}
        {locationLabel ? (
          <Text style={styles.locationLabel} numberOfLines={2}>
            {locationLabel}
          </Text>
        ) : null}
      </View>
      <View style={styles.buttons}>
        <AnimatedPressable
          onPress={handleGoThere}
          disabled={!valid}
          style={[styles.btn, styles.btnPrimary]}
          scale={0.98}
        >
          <View style={styles.btnIconText}>
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.btnPrimaryText}>Go there</Text>
          </View>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 16,
    color: "#374151",
  },
  mapWrap: {
    flex: 1,
    minHeight: 240,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  info: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  locationLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  buttons: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  btnIconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: "#f97316",
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
