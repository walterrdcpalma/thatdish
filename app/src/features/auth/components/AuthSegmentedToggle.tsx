import { View, Text } from "react-native";
import { AnimatedPressable } from "@/src/shared/components";

const LIME = "#a3e635";

type Tab = "login" | "signup";

export function AuthSegmentedToggle({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <View className="flex-row rounded-xl bg-black/40 p-1">
      <AnimatedPressable
        onPress={() => onChange("login")}
        scale={0.98}
        className="flex-1 rounded-lg py-2.5"
        style={{ backgroundColor: value === "login" ? LIME : "transparent" }}
      >
        <Text
          className="text-center text-sm font-semibold"
          style={{ color: value === "login" ? "#0a0a0a" : "#e5e5e5" }}
        >
          Login
        </Text>
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => onChange("signup")}
        scale={0.98}
        className="flex-1 rounded-lg py-2.5"
        style={{ backgroundColor: value === "signup" ? LIME : "transparent" }}
      >
        <Text
          className="text-center text-sm font-semibold"
          style={{ color: value === "signup" ? "#0a0a0a" : "#e5e5e5" }}
        >
          Sign up
        </Text>
      </AnimatedPressable>
    </View>
  );
}
