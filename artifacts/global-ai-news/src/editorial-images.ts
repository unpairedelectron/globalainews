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
export const EDITORIAL_IMAGE_WIDTHS = [480, 768, 1024] as const;

export function getEditorialImagePath(slug: string): string {
  const imageName = publishedEditorialImages.has(slug) ? slug : 'fallback';
  return `/images/editorial/${imageName}.jpg`;
}

export function getEditorialImageSources(slug: string) {
  const imageName = publishedEditorialImages.has(slug) ? slug : 'fallback';
  const srcSet = (format: 'avif' | 'webp') =>
    EDITORIAL_IMAGE_WIDTHS
      .map((width) => `/images/editorial/${imageName}-${width}.${format} ${width}w`)
      .join(', ');

  return {
    avif: srcSet('avif'),
    webp: srcSet('webp'),
  };
}
