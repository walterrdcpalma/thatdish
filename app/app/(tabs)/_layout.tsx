import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TAB_ORANGE = "#f97316";

function AddTabBarButton(
  props: React.ComponentProps<React.ElementType> & { children?: React.ReactNode }
) {
  const router = useRouter();
  const { style, onPress: _onPress, ...rest } = props;
  return (
    <View
      style={[style, { alignItems: "center", justifyContent: "flex-end" }]}
      {...rest}
    >
      <Pressable
        onPress={() => router.push("/dish/create")}
        className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-orange-500 shadow-md"
        style={{ shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </View>
  );
}
const FOCUSED_SCALE = 1.1;

function ScaleOnFocus({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(focused ? FOCUSED_SCALE : 1);
  useEffect(() => {
    scale.value = withTiming(focused ? FOCUSED_SCALE : 1, { duration: 200 });
  }, [focused, scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

function TabLabel({
  focused,
  color,
  children,
}: {
  focused: boolean;
  color: string;
  children: string;
}) {
  return (
    <ScaleOnFocus focused={focused}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 12,
            color,
            fontWeight: focused ? "600" : "400",
          }}
        >
          {children}
        </Text>
        {focused && (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: TAB_ORANGE,
              marginTop: 4,
            }}
          />
        )}
      </View>
    </ScaleOnFocus>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_ORANGE,
        tabBarInactiveTintColor: "#000",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarLabel: ({ focused, color, children }) => (
          <TabLabel focused={focused} color={color} children={children} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <ScaleOnFocus focused={focused}>
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            </ScaleOnFocus>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <ScaleOnFocus focused={focused}>
              <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
            </ScaleOnFocus>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <AddTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <ScaleOnFocus focused={focused}>
              <Ionicons name={focused ? "bookmark" : "bookmark-outline"} size={24} color={color} />
            </ScaleOnFocus>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <ScaleOnFocus focused={focused}>
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
            </ScaleOnFocus>
          ),
        }}
      />
    </Tabs>
  );
}
