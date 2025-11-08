import type { CacheClientPort } from '@shared/ports/cache/CacheClientPort';
import { ForbiddenException } from '@shared/exceptions/ForbiddenException';

export async function checkIfUserIsBlocked(
  userId: string,
  cacheClient: CacheClientPort,
): Promise<void> {
  try {
    const isBlocked = await cacheClient.isBlocked(userId);
    if (isBlocked) {
      throw new ForbiddenException('Your account has been blocked');
    }
  } catch (error) {
    if (error instanceof ForbiddenException) {
      throw error;
    }
    // console.error('Error checking blocked users from cache:', error);
  }
}
