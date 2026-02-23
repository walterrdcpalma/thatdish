import { useState, Fragment } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { AuthSegmentedPill } from "../components/AuthSegmentedPill";
import { AuthInput } from "../components/AuthInput";
import { SocialAuthButtons } from "../components/SocialAuthButtons";
import { AnimatedPressable } from "@/src/shared/components";

const ORANGE = "#f97316";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

type Tab = "login" | "signup";

export function AuthScreen() {
  const {
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    resetPasswordForEmail,
  } = useAuth();

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);
    const result = await signInWithGoogle();
    setLoadingGoogle(false);
    if (result.error) setError(result.error);
  };

  const handleApple = async () => {
    setError(null);
    setLoadingApple(true);
    const result = await signInWithApple();
    setLoadingApple(false);
    if (result.error) setError(result.error);
  };

  const validateLogin = (): string | null => {
    const e = email.trim();
    if (!e) return "Email is required.";
    if (!EMAIL_REGEX.test(e)) return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters.`;
    return null;
  };

  const validateSignUp = (): string | null => {
    const e = email.trim();
    if (!name.trim()) return "Name is required.";
    if (!e) return "Email is required.";
    if (!EMAIL_REGEX.test(e)) return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters.`;
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleLogin = async () => {
    setError(null);
    const err = validateLogin();
    if (err) {
      setError(err);
      return;
    }
    setLoadingEmail(true);
    const result = await signInWithEmail(email.trim(), password);
    setLoadingEmail(false);
    if (result.error) setError(result.error);
  };

  const handleSignUp = async () => {
    setError(null);
    const err = validateSignUp();
    if (err) {
      setError(err);
      return;
    }
    setLoadingEmail(true);
    const result = await signUpWithEmail(email.trim(), password, name.trim());
    setLoadingEmail(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSignUpSuccess(true);
  };

  const handleForgotPassword = async () => {
    const e = email.trim();
    if (!e || !EMAIL_REGEX.test(e)) {
      setError("Enter a valid email above first.");
      return;
    }
    setError(null);
    setLoadingForgot(true);
    const result = await resetPasswordForEmail(e);
    setLoadingForgot(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccessMessage("Check your email for the reset link.");
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError(null);
    setSuccessMessage(null);
    setSignUpSuccess(false);
  };

  const anyLoading = loadingGoogle || loadingApple || loadingEmail;

  const titleLogin = "Sign up or log in to discover dishes";
  const titleSignUp = "Sign up, share your favourite dishes";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
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
            <Text
              className="mb-4 text-center text-xl font-bold text-black"
              style={{ lineHeight: 28 }}
            >
              {tab === "login" ? titleLogin : titleSignUp}
            </Text>

            <AuthSegmentedPill value={tab} onChange={switchTab} />

            {signUpSuccess && tab === "signup" ? (
              <View className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
                <Text
                  className="text-center text-base font-semibold text-gray-900"
                  style={{ lineHeight: 22 }}
                >
                  Registo completado com sucesso.
                </Text>
                <Text
                  className="mt-2 text-center text-sm text-gray-600"
                  style={{ lineHeight: 20 }}
                >
                  Só falta confirmares o teu email para ativar a conta.
                </Text>
              </View>
            ) : (
              <Fragment>
                <View className="mt-5 gap-4">
                  {tab === "signup" && (
                    <AuthInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                leftIcon="person-outline"
                      textContentType="name"
                      autoCapitalize="words"
                    />
                  )}
                  <AuthInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email Address"
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  <AuthInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    showPassword={showPassword}
                    onToggleShowPassword={() => setShowPassword((p) => !p)}
                    leftIcon="lock-closed-outline"
                    textContentType="password"
                  />
                  {tab === "signup" && (
                    <AuthInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm Password"
                      secureTextEntry
                      showPassword={showConfirmPassword}
                      onToggleShowPassword={() => setShowConfirmPassword((p) => !p)}
                      leftIcon="lock-closed-outline"
                      textContentType="password"
                      error={
                        confirmPassword && password !== confirmPassword
                          ? "Passwords do not match"
                          : undefined
                      }
                    />
                  )}

                  {tab === "login" && (
                    <View className="items-end pt-1">
                      <Pressable
                        onPress={handleForgotPassword}
                        disabled={loadingForgot || anyLoading}
                      >
                        {loadingForgot ? (
                          <ActivityIndicator size="small" color={ORANGE} />
                        ) : (
                          <Text className="text-sm font-medium" style={{ color: ORANGE }}>
                            Forgot password
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  )}

                  <AnimatedPressable
                    onPress={tab === "login" ? handleLogin : handleSignUp}
                    disabled={anyLoading || loadingForgot}
                    scale={0.98}
                    className="mt-2 w-full items-center justify-center rounded-xl py-3.5"
                    style={{ backgroundColor: ORANGE }}
                  >
                    {loadingEmail ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text className="text-base font-semibold text-white">
                        {tab === "login" ? "Login" : "Sign up"}
                      </Text>
                    )}
                  </AnimatedPressable>
                </View>

                <View className="mt-6 flex-row items-center gap-3">
                  <View className="h-px flex-1 bg-gray-200" />
                  <Text className="text-sm text-gray-500">Or login with</Text>
                  <View className="h-px flex-1 bg-gray-200" />
                </View>

                <SocialAuthButtons
                  onGoogle={handleGoogle}
                  onApple={handleApple}
                  loadingGoogle={loadingGoogle}
                  loadingApple={loadingApple}
                  disabled={anyLoading}
                />
              </Fragment>
            )}

            {error ? (
              <Text className="mt-4 text-center text-sm text-red-600">{error}</Text>
            ) : null}
            {successMessage ? (
              <Text className="mt-4 text-center text-sm text-green-600">
                {successMessage}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
