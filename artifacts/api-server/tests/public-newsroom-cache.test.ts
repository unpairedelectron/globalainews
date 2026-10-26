import assert from "node:assert/strict";
import test from "node:test";

import {
  isPublicNewsroomCacheFresh,
  publicNewsroomCacheControl,
  publicNewsroomSnapshotExpiresAt,
  PUBLIC_NEWSROOM_CONTENT_CACHE_TTL_MS,
} from "../src/lib/public-newsroom-cache.ts";

test("public newsroom snapshots have a bounded ten-minute memory lifetime", () => {
  const cachedAt = 1_000_000;
  const expiresAt = publicNewsroomSnapshotExpiresAt(cachedAt);

  assert.equal(PUBLIC_NEWSROOM_CONTENT_CACHE_TTL_MS, 10 * 60 * 1000);
  assert.equal(expiresAt, cachedAt + 10 * 60 * 1000);
  assert.equal(isPublicNewsroomCacheFresh({ cachedAt, expiresAt }, expiresAt - 1), true);
  assert.equal(isPublicNewsroomCacheFresh({ cachedAt, expiresAt }, expiresAt), false);
});

test("a scheduled publication shortens memory and shared-cache freshness", () => {
  const cachedAt = 1_000_000;
  const nextPublicationAt = cachedAt + 90_000;
  const expiresAt = publicNewsroomSnapshotExpiresAt(cachedAt, nextPublicationAt);

  assert.equal(expiresAt, nextPublicationAt);
  assert.equal(publicNewsroomCacheControl(expiresAt, cachedAt), "public, max-age=0, s-maxage=90");
  assert.equal(publicNewsroomCacheControl(expiresAt, nextPublicationAt), "public, max-age=0, s-maxage=0");
});

test("shared cache freshness is capped at five minutes", () => {
  const cachedAt = 1_000_000;
  const expiresAt = publicNewsroomSnapshotExpiresAt(cachedAt);

  assert.equal(publicNewsroomCacheControl(expiresAt, cachedAt), "public, max-age=0, s-maxage=300");
});
