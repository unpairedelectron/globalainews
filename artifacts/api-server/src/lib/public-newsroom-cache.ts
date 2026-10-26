export const PUBLIC_NEWSROOM_CONTENT_CACHE_TTL_MS = 10 * 60 * 1000;
export const PUBLIC_NEWSROOM_SHARED_CACHE_MAX_AGE_MS = 5 * 60 * 1000;

export type PublicNewsroomCacheEntry = {
  cachedAt: number;
  expiresAt: number;
};

export function isPublicNewsroomCacheFresh(
  entry: PublicNewsroomCacheEntry,
  now: number,
): boolean {
  return now >= entry.cachedAt && now < entry.expiresAt;
}

export function publicNewsroomSnapshotExpiresAt(
  cachedAt: number,
  nextPublicationAt?: number,
): number {
  const ttlExpiresAt = cachedAt + PUBLIC_NEWSROOM_CONTENT_CACHE_TTL_MS;
  return nextPublicationAt !== undefined && nextPublicationAt > cachedAt
    ? Math.min(ttlExpiresAt, nextPublicationAt)
    : ttlExpiresAt;
}

export function publicNewsroomCacheControl(expiresAt: number, now: number): string {
  const remainingMs = Math.max(0, expiresAt - now);
  const sharedMaxAgeSeconds = Math.floor(
    Math.min(PUBLIC_NEWSROOM_SHARED_CACHE_MAX_AGE_MS, remainingMs) / 1000,
  );
  return `public, max-age=0, s-maxage=${sharedMaxAgeSeconds}`;
}
