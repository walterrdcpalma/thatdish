export const env = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
} as const;
