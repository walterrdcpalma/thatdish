import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";

const BTN_HEIGHT = 48;
const ICON_TEXT_GAP = 10;

export function SocialAuthButtons({
  onGoogle,
  onApple,
  loadingGoogle,
  loadingApple,
  disabled,
}: {
  onGoogle: () => void;
  onApple: () => void;
  loadingGoogle: boolean;
  loadingApple: boolean;
  disabled?: boolean;
}) {
  const isDisabled = disabled || loadingGoogle || loadingApple;

  return (
    <View className="mt-4 flex-row gap-3">
      <AnimatedPressable
        onPress={onGoogle}
        disabled={isDisabled}
        scale={0.98}
        className="flex-1 flex-row items-center justify-center rounded-xl border border-gray-200 bg-gray-50"
        style={{ minHeight: BTN_HEIGHT, height: BTN_HEIGHT, gap: ICON_TEXT_GAP }}
      >
        {loadingGoogle ? (
          <ActivityIndicator color="#374151" size="small" />
        ) : (
          <View className="flex-row items-center" style={{ gap: ICON_TEXT_GAP }}>
            <Ionicons name="logo-google" size={20} color="#374151" />
            <Text className="text-base font-medium text-gray-800">Google</Text>
          </View>
        )}
      </AnimatedPressable>
      <AnimatedPressable
        onPress={onApple}
        disabled={isDisabled}
        scale={0.98}
        className="flex-1 flex-row items-center justify-center rounded-xl border border-gray-200 bg-gray-50"
        style={{ minHeight: BTN_HEIGHT, height: BTN_HEIGHT, gap: ICON_TEXT_GAP }}
      >
        {loadingApple ? (
          <ActivityIndicator color="#374151" size="small" />
        ) : (
          <View className="flex-row items-center" style={{ gap: ICON_TEXT_GAP }}>
            <Ionicons name="logo-apple" size={20} color="#374151" />
            <Text className="text-base font-medium text-gray-800">Apple</Text>
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
}
