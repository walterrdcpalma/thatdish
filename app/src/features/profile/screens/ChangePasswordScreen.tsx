import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { AnimatedPressable } from "@/src/shared/components";

const ORANGE = "#f97316";
const MIN_PASSWORD = 8;

export function ChangePasswordScreen() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (newPassword.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const result = await updatePassword(newPassword);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          <View className="border-b border-gray-100 px-4 pb-3 pt-1">
            <AnimatedPressable
              onPress={() => router.back()}
              scale={0.98}
              className="mb-2 flex-row items-center gap-2 py-2"
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
              <Text className="text-base text-gray-700">Back</Text>
            </AnimatedPressable>
            <Text className="text-2xl font-bold text-black">Change password</Text>
          </View>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 48,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {success ? (
              <View className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <Text
                  className="text-center text-base font-semibold text-gray-900"
                  style={{ lineHeight: 22 }}
                >
                  Password alterada com sucesso.
                </Text>
                <AnimatedPressable
                  onPress={() => router.back()}
                  scale={0.98}
                  className="mt-4 w-full items-center justify-center rounded-xl py-3"
                  style={{ backgroundColor: ORANGE }}
                >
                  <Text className="text-base font-semibold text-white">Voltar</Text>
                </AnimatedPressable>
              </View>
            ) : (
              <>
                <AuthInput
                  value={newPassword}
                  onChangeText={(t) => {
                    setNewPassword(t);
                    setError(null);
                  }}
                  placeholder="New password"
                  secureTextEntry
                  showPassword={showNew}
                  onToggleShowPassword={() => setShowNew((p) => !p)}
                  leftIcon="lock-closed-outline"
                  textContentType="newPassword"
                />
                <View className="mt-4">
                  <AuthInput
                    value={confirmPassword}
                    onChangeText={(t) => {
                      setConfirmPassword(t);
                      setError(null);
                    }}
                    placeholder="Confirm new password"
                    secureTextEntry
                    showPassword={showConfirm}
                    onToggleShowPassword={() => setShowConfirm((p) => !p)}
                    leftIcon="lock-closed-outline"
                    textContentType="newPassword"
                    error={
                      confirmPassword && newPassword !== confirmPassword
                        ? "Passwords do not match"
                        : undefined
                    }
                  />
                </View>
                {error ? (
                  <Text className="mt-4 text-center text-sm text-red-600">{error}</Text>
                ) : null}
                <AnimatedPressable
                  onPress={handleSubmit}
                  disabled={loading}
                  scale={0.98}
                  className="mt-6 w-full items-center justify-center rounded-xl py-3.5"
                  style={{ backgroundColor: ORANGE }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-base font-semibold text-white">
                      Alterar password
                    </Text>
                  )}
                </AnimatedPressable>
              </>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
