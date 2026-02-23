import type { User } from "@supabase/supabase-js";

/**
 * Returns true if the user has email/password as an auth provider (local password).
 * Used to show "Change password" only for accounts that support it; hide for Google/Apple.
 *
 * Detection: Supabase stores provider in both `user.identities[].provider` and
 * `user.app_metadata.provider` / `user.app_metadata.providers`. We check identities
 * first (canonical list of linked auth methods), then app_metadata as fallback.
 */
export function isEmailPasswordUser(user: User | null | undefined): boolean {
  if (!user) return false;
  if (Array.isArray(user.identities) && user.identities.length > 0) {
    return user.identities.some((i) => i.provider === "email");
  }
  const provider = user.app_metadata?.provider;
  const providers = user.app_metadata?.providers as string[] | undefined;
  return provider === "email" || (Array.isArray(providers) && providers.includes("email"));
}
