import { View, TextInput, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AuthInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  onToggleShowPassword?: () => void;
  leftIcon: string;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "visible-password";
  textContentType?:
    | "none"
    | "emailAddress"
    | "password"
    | "username"
    | "name"
    | "givenName"
    | "familyName";
  autoCorrect?: boolean;
};

export function AuthInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showPassword,
  onToggleShowPassword,
  leftIcon,
  error,
  autoCapitalize = "none",
  keyboardType = "default",
  textContentType,
  autoCorrect = false,
}: AuthInputProps) {
  const isPassword = secureTextEntry || textContentType === "password";
  const showToggle = isPassword && onToggleShowPassword != null;

  return (
    <View className="w-full">
      <View
        className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4"
        style={{ minHeight: 52 }}
      >
        <Ionicons name={leftIcon} size={20} color="#374151" style={{ marginRight: 12 }} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          textContentType={textContentType}
          autoCorrect={autoCorrect}
          className="flex-1 py-3 text-base text-gray-800"
          style={{ minWidth: 0 }}
        />
        {showToggle ? (
          <Pressable onPress={onToggleShowPassword} hitSlop={12}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6b7280"
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1.5 text-sm text-red-600">{error}</Text>
      ) : null}
    </View>
  );
}
