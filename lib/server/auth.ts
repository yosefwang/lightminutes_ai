import { auth } from '@clerk/nextjs/server';

/**
 * Get authenticated user ID from Clerk
 * Throws error if not authenticated
 */
export async function getAuthUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized: No user ID found');
  }
  return userId;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}
