type DatedArticleLink = { articleSlug: string; publishAt: string };

export type ReleaseDiscoveryData = {
  briefs: readonly DatedArticleLink[];
  signals: readonly DatedArticleLink[];
  topics: readonly { storySlugs: readonly string[]; [key: string]: unknown }[];
  glossaryLinks: readonly DatedArticleLink[];
};

export function getVisibleReleaseDiscovery<T extends ReleaseDiscoveryData>(
  discovery: T,
  publishedSlugs: ReadonlySet<string>,
  now: Date,
) {
  const isLive = ({ articleSlug, publishAt }: DatedArticleLink) =>
    publishedSlugs.has(articleSlug) && Date.parse(publishAt) <= now.getTime();
  return {
    briefs: discovery.briefs.filter(isLive),
    signals: discovery.signals.filter(isLive),
    topics: discovery.topics.flatMap((topic) => {
      const storySlugs = topic.storySlugs.filter((slug) => publishedSlugs.has(slug));
      return storySlugs.length ? [{ ...topic, storySlugs }] : [];
    }),
    glossaryLinks: discovery.glossaryLinks.filter(isLive),
  };
}
