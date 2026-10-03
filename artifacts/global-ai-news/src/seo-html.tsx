import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { getPublicDateModified, type NewsroomContentSnapshot } from './content';
import { getCanonicalUrl, getStructuredData, SITE_URL, type SeoMetadata } from './seo-metadata';
import { SeoPrerender } from './seo-prerender';

const prerenderPublicNoindexRoutes = new Set([
  '/search',
  '/archive',
  '/about-us',
  '/code-of-ethics',
  '/corrections',
  '/contact-us',
]);

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function safeJsonLd(value: string): string {
  return value
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

export function renderSeoRouteHtml(
  baseHtml: string,
  route: string,
  metadata: SeoMetadata,
  contentSnapshot: NewsroomContentSnapshot,
): string {
  const canonical = getCanonicalUrl(metadata.path);
  const articleSlug = metadata.article
    ? metadata.path.match(/^\/article\/([^/]+)$/)?.[1]
    : undefined;
  const articleStory = articleSlug
    ? contentSnapshot.stories.find((story) => story.slug === articleSlug)
    : undefined;
  const articleAuthor = articleStory
    ? contentSnapshot.authors.find((author) => author.slug === articleStory.author)
    : undefined;
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonicalUrl = escapeHtml(canonical);
  const imageUrl = metadata.imagePath
    ? escapeHtml(`${SITE_URL}${metadata.imagePath}`)
    : undefined;
  const imageTags = imageUrl
    ? `
    <meta property="og:image" content="${imageUrl}" data-global-ai-meta-path="${escapeHtml(metadata.path)}" />
    <meta property="og:image:alt" content="${escapeHtml(metadata.imageAlt ?? metadata.title)}" data-global-ai-meta-path="${escapeHtml(metadata.path)}" />
    <meta property="og:image:type" content="image/png" />
    <meta name="twitter:image" content="${imageUrl}" data-global-ai-meta-path="${escapeHtml(metadata.path)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(metadata.imageAlt ?? metadata.title)}" data-global-ai-meta-path="${escapeHtml(metadata.path)}" />`
    : '';
  const articleDateModified = articleStory
    ? getPublicDateModified(articleStory)
    : undefined;
  const articleTags = articleStory
    ? `
    <meta property="article:published_time" content="${escapeHtml(articleStory.date)}" />
    ${articleDateModified
      ? `<meta property="article:modified_time" content="${escapeHtml(articleDateModified)}" />`
      : ''}
    ${articleAuthor
      ? `<meta property="article:author" content="${escapeHtml(getCanonicalUrl(`/person/${articleAuthor.slug}`))}" />`
      : ''}
    <meta property="article:section" content="${escapeHtml(articleStory.category)}" />`
    : '';

  const existingHeadMetadata = [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta\b[^>]*name=["']robots["'][^>]*>\s*/gi,
    /<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|og:url|og:type|og:site_name|og:image|og:image:alt|og:image:type|twitter:title|twitter:description|twitter:card|twitter:image|twitter:image:alt|article:published_time|article:modified_time|article:author|article:section)["'][^>]*>\s*/gi,
    /<link\b[^>]*rel=["'](?:canonical|amphtml)["'][^>]*>\s*/gi,
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
  ];
  let html = baseHtml;
  for (const pattern of existingHeadMetadata) html = html.replace(pattern, '');

  const ampLink = metadata.ampPath
    ? `\n    <link rel="amphtml" href="${escapeHtml(`${SITE_URL}${metadata.ampPath}`)}" />`
    : '';
  const structuredData = safeJsonLd(
    getStructuredData(metadata, contentSnapshot.stories, contentSnapshot.authors, contentSnapshot),
  );
  const headMetadata = `    <title>${title}</title>
    <meta name="description" content="${description}" />
    ${metadata.indexable === false ? '<meta name="robots" content="noindex,follow" />' : ''}
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${metadata.article ? 'article' : 'website'}" />
    <meta property="og:site_name" content="Global AI News" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />${imageTags}${articleTags}${ampLink}
    <script type="application/ld+json" data-global-ai-ld>${structuredData}</script>
`;
  html = html.replace('</head>', `${headMetadata}  </head>`);

  const shouldPrerender =
    metadata.indexable !== false || prerenderPublicNoindexRoutes.has(route);
  const prerenderedBody = shouldPrerender
    ? renderToStaticMarkup(
        createElement(SeoPrerender, {
          route,
          metadata,
          snapshot: contentSnapshot,
        }),
      )
    : '';
  const bootstrapMarker = shouldPrerender
    ? '<script id="global-ai-prerender" type="application/json">{}</script>'
    : '';
  const rootPlaceholder = /<div\s+id=["']root["']>\s*<\/div>/;
  if (!rootPlaceholder.test(html)) {
    throw new Error(`Cannot render ${route}: the HTML template has no empty #root element.`);
  }
  return html.replace(
    rootPlaceholder,
    `<div id="root">${prerenderedBody}</div>${bootstrapMarker}`,
  );
}