export interface ArticlePublishState {
  status?: unknown;
  publishAt?: unknown;
}

export function isArticlePublishable(
  state: ArticlePublishState | undefined,
  now = new Date(),
): boolean {
  if (state?.status !== 'published' || typeof state.publishAt !== 'string') return false;
  const publishAt = Date.parse(state.publishAt);
  return Number.isFinite(publishAt) && publishAt <= now.getTime();
}

export function makePublishedArticleHtml(stagingHtml: string): string {
  const robotsTag = /<meta\s+name=["']robots["']\s+content=["']noindex(?:,(?:follow|nofollow))?["']\s*\/?>/i;
  if (!robotsTag.test(stagingHtml)) {
    throw new Error('Staging article is missing its noindex robots tag.');
  }
  return stagingHtml
    .replace(robotsTag, '<meta name="robots" content="index,follow">')
    .replace(
      /<meta\s+name=["']googlebot["']\s+content=["']noindex(?:,(?:follow|nofollow))?["']\s*\/?>/i,
      '<meta name="googlebot" content="index,follow">',
    );
}
