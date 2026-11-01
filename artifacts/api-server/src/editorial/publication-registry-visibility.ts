export type PublicationStateRecord = {
  slug: string;
  status: string;
  publishAt: Date;
  updatedAt: Date;
};

export type RegistryArticleRecord = {
  slug: string;
  title: string;
  description: string;
  topic: string;
};

export function getVisibleRegistryArticles(
  registry: readonly RegistryArticleRecord[],
  states: readonly PublicationStateRecord[],
  now: Date,
) {
  const stateBySlug = new Map(states.map((state) => [state.slug, state]));
  return registry.flatMap((article) => {
    const state = stateBySlug.get(article.slug);
    if (!state || state.status !== "published" || state.publishAt.getTime() > now.getTime()) return [];
    return [{
      slug: article.slug,
      title: article.title,
      description: article.description,
      topic: article.topic,
      publishAt: state.publishAt,
      lastmod: state.updatedAt,
    }];
  });
}
