import { articleRegistry } from './article-registry.generated';

export type PublicPublicationState = {
  slug: string;
  publishAt: string;
  status: string;
};

export function getVisibleReleaseArticles(
  states: readonly PublicPublicationState[],
  now = Date.now(),
) {
  const bySlug = new Map(states.map((state) => [state.slug, state]));
  return articleRegistry.filter((article) => {
    const state = bySlug.get(article.slug);
    return state?.status === 'published' && Date.parse(state.publishAt) <= now;
  });
}
