const publishedEditorialImages = new Set([
  'india-ai-compute-access-2026',
  'weekly-deep-dive-cost-of-intelligence',
  'reliability-is-the-new-ai-moat',
  'study-finds-word-cues-can-override-game-theory-choices-in-llms',
  'ai-models-antibiotic-discovery',
  'quiet-race-watermark-everything-ai-makes',
  'small-models-serious-workflows',
]);

export const EDITORIAL_IMAGE_FALLBACK = '/images/editorial/fallback.jpg';

export function getEditorialImagePath(slug: string): string {
  const imageName = publishedEditorialImages.has(slug) ? slug : 'fallback';
  return `/images/editorial/${imageName}.jpg`;
}
