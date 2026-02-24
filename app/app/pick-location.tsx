import { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";
import { setLastPickedLocation } from "@/src/features/dish/pickLocationResult";

const DEFAULT_LAT = 38.7223;
const DEFAULT_LNG = -9.1393;
const DEFAULT_DELTA = 0.01;
const ICON_TEXT_GAP = 10;

function regionToCenter(region: Region): { lat: number; lng: number } {
  return {
    lat: region.latitude,
    lng: region.longitude,
  };
}

export default function PickLocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ initialLat?: string; initialLng?: string }>();
  const initialLat = params.initialLat != null ? parseFloat(params.initialLat) : DEFAULT_LAT;
  const initialLng = params.initialLng != null ? parseFloat(params.initialLng) : DEFAULT_LNG;

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: Number.isFinite(initialLat) ? initialLat : DEFAULT_LAT,
    lng: Number.isFinite(initialLng) ? initialLng : DEFAULT_LNG,
  });
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [loadingMyLocation, setLoadingMyLocation] = useState(false);
  const mapRef = useRef<MapView>(null);

  const initialRegion: Region = {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: DEFAULT_DELTA,
    longitudeDelta: DEFAULT_DELTA,
  };

  const onRegionChangeComplete = useCallback((region: Region) => {
    setCenter(regionToCenter(region));
  }, []);

  const handleUseMyLocation = useCallback(async () => {
    setLoadingMyLocation(true);
    setLocationPermissionDenied(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationPermissionDenied(true);
        Alert.alert(
          "Location permission",
          "Location access was denied. You can still move the map manually to pick a spot."
        );
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCenter({ lat, lng });
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
      });
    } catch {
      Alert.alert(
        "Location unavailable",
        "Could not get your location. You can move the map manually to pick a spot."
      );
    } finally {
      setLoadingMyLocation(false);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setLastPickedLocation(center);
    router.back();
  }, [center, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pick location</Text>
      </View>
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onRegionChangeComplete={onRegionChangeComplete}
          showsUserLocation={!locationPermissionDenied}
          showsMyLocationButton={false}
        />
        <View style={styles.pinOverlay} pointerEvents="none">
          <Ionicons name="location" size={40} color="#dc2626" />
        </View>
      </View>
      {locationPermissionDenied && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Location access denied. Move the map to pick a spot.</Text>
        </View>
      )}
      <View style={styles.buttons}>
        <AnimatedPressable
          onPress={handleUseMyLocation}
          disabled={loadingMyLocation}
          style={[styles.btn, styles.btnSecondary]}
          scale={0.98}
        >
          {loadingMyLocation ? (
            <ActivityIndicator size="small" color="#374151" />
          ) : (
            <View style={styles.iconTextRow}>
              <Ionicons name="locate" size={20} color="#374151" />
              <Text style={styles.btnSecondaryText}>Use my location</Text>
            </View>
          )}
        </AnimatedPressable>
        <AnimatedPressable
          onPress={handleConfirm}
          style={[styles.btn, styles.btnPrimary]}
          scale={0.98}
        >
          <Text style={styles.btnPrimaryText}>Confirm location</Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={handleCancel}
          style={[styles.btn, styles.btnCancel]}
          scale={0.98}
        >
          <Text style={styles.btnCancelText}>Cancel</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  mapWrap: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  pinOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fef3c7",
  },
  bannerText: {
    fontSize: 13,
    color: "#92400e",
  },
  buttons: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ICON_TEXT_GAP,
  },
  btnSecondary: {
    backgroundColor: "#f3f4f6",
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  btnPrimary: {
    backgroundColor: "#f97316",
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  btnCancel: {
    backgroundColor: "transparent",
  },
  btnCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
});
