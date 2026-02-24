import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TAB_ORANGE = "#f97316";
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
          tabBarIcon: ({ color, focused }) => (
            <ScaleOnFocus focused={focused}>
              <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={24} color={color} />
            </ScaleOnFocus>
          ),
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          title: "Rankings",
          tabBarIcon: ({ color, focused }) => (
            <ScaleOnFocus focused={focused}>
              <Ionicons name={focused ? "trophy" : "trophy-outline"} size={24} color={color} />
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
