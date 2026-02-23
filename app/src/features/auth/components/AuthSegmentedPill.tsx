import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ORANGE = "#f97316";

const PILL_DURATION_MS = 220;
const pillEasing = Easing.bezier(0.25, 0.1, 0.25, 1);

type Tab = "login" | "signup";

export function AuthSegmentedPill({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (tab: Tab) => void;
}) {
  const segmentWidth = useSharedValue(0);
  const translateX = useSharedValue(value === "signup" ? 1 : 0);

  useEffect(() => {
    translateX.value = withTiming(value === "signup" ? 1 : 0, {
      duration: PILL_DURATION_MS,
      easing: pillEasing,
    });
    // translateX is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handlePress = (tab: Tab) => {
    if (tab === value) return;
    onChange(tab);
    translateX.value = withTiming(tab === "signup" ? 1 : 0, {
      duration: PILL_DURATION_MS,
      easing: pillEasing,
    });
  };

  const pillStyle = useAnimatedStyle(() => {
    "worklet";
    const w = segmentWidth.value;
    if (w <= 0) return { opacity: 0, width: 0 };
    return {
      opacity: 1,
      width: w,
      transform: [{ translateX: translateX.value * w }],
    };
  });

  return (
    <View
      className="flex-row rounded-full bg-gray-200 p-1"
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) {
          segmentWidth.value = (w - 8) / 2;
        }
      }}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute left-1 top-1 bottom-1 rounded-full"
        style={[{ backgroundColor: ORANGE }, pillStyle]}
      />
      <Pressable
        onPress={() => handlePress("login")}
        className="flex-1 items-center justify-center py-2.5"
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: value === "login" ? "#fff" : "#374151" }}
        >
          Login
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handlePress("signup")}
        className="flex-1 items-center justify-center py-2.5"
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: value === "signup" ? "#fff" : "#374151" }}
        >
          Sign up
        </Text>
      </Pressable>
    </View>
  );
}
