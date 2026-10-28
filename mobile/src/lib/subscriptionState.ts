/**
 * What the app may say about an account, derived from the SAME subscription answer the
 * website uses (GET /api/user-subscription/:id, merged into the session by lib/auth.tsx).
 * `free_questions_remaining` is a number for a free-tier account and null for an account
 * with full access (paid, granted, grandfathered, or enforcement off).
 */
export type AccountAccess = 'subscriber' | 'free' | 'free_spent';

type UserLike = { free_questions_remaining?: number | null } | null | undefined;

export function accountAccess(user: UserLike): AccountAccess {
  const left = user?.free_questions_remaining;
  if (typeof left !== 'number') return 'subscriber';
  return left > 0 ? 'free' : 'free_spent';
}

/** True when the account has no active subscription (a purchase would be needed for more). */
export const needsSubscription = (user: UserLike): boolean => accountAccess(user) !== 'subscriber';
