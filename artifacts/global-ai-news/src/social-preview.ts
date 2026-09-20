export const socialPreviewWidth = 1200;
export const socialPreviewHeight = 630;
export const socialPreviewTitleMaxWidth = 1040;

export const previewTitleColor = '#101820';
export const socialPreviewTitleX = 80;
export const socialPreviewTitleStartY = 268;
export const socialPreviewFooterY = 578;

interface PreviewTitleStyle {
  maxCharacters: number;
  fontSize: number;
  lineHeight: number;
  maxLines: number;
}

export interface PreviewTitleLayout {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  maxCharacters: number;
}

export const previewTitleStyles: readonly PreviewTitleStyle[] = [
  { maxCharacters: 34, fontSize: 54, lineHeight: 66, maxLines: 3 },
  { maxCharacters: 40, fontSize: 46, lineHeight: 56, maxLines: 4 },
  { maxCharacters: 46, fontSize: 40, lineHeight: 48, maxLines: 5 },
  { maxCharacters: 54, fontSize: 34, lineHeight: 42, maxLines: 6 },
  { maxCharacters: 61, fontSize: 30, lineHeight: 38, maxLines: 7 },
];

export interface PreviewTitlePixelRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function socialPreviewAccent(slug: string): string {
  const hash = [...slug].reduce((total, character) => total + character.charCodeAt(0), 0);
  return ['#006cff', '#b2472d', '#55704f', '#8b5e34'][hash % 4];
}

export function wrapPreviewTitle(title: string, maxCharacters: number, route = 'preview card'): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > maxCharacters) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function estimatedLineWidth(line: string, fontSize: number): number {
  return line.length * fontSize * 0.56;
}

export function layoutPreviewTitle(title: string, route = 'preview card'): PreviewTitleLayout {
  const normalizedTitle = title.trim().replace(/\s+/g, ' ');
  if (!normalizedTitle) throw new Error(`${route}: preview title cannot be empty.`);

  for (const style of previewTitleStyles) {
    const lines = wrapPreviewTitle(normalizedTitle, style.maxCharacters, route);
    if (
      lines.length <= style.maxLines &&
      lines.every((line) => estimatedLineWidth(line, style.fontSize) <= socialPreviewTitleMaxWidth)
    ) {
      return {
        lines,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        maxCharacters: style.maxCharacters,
      };
    }
  }

  throw new Error(
    `${route}: preview title does not fit the available card area without clipping: "${normalizedTitle}"`,
  );
}

function escapeSvg(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const previewBackgroundColor = '#f4f1ea';

export function renderSocialPreviewSvg(title: string, category: string, slug: string): string {
  const route = `/article/${slug}`;
  const layout = layoutPreviewTitle(title, route);
  const accent = previewAccent(slug);
  const titleMarkup = layout.lines
    .map((line, index) => `<text x="${previewTitleX}" y="${previewTitleBaselineY + index * layout.lineHeight}" fill="${previewTitleColor}" font-family="Georgia, 'Times New Roman', serif" font-size="${layout.fontSize}" font-weight="700">${escapeSvg(line)}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${socialPreviewWidth}" height="${socialPreviewHeight}" viewBox="0 0 ${socialPreviewWidth} ${socialPreviewHeight}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeSvg(title)}</title>
  <desc id="desc">Global AI News editorial preview for ${escapeSvg(title)}</desc>
  <rect width="${socialPreviewWidth}" height="${socialPreviewHeight}" fill="${previewBackgroundColor}"/>
  <circle cx="1000" cy="150" r="184" fill="none" stroke="${accent}" stroke-width="2"/>
  <circle cx="1000" cy="150" r="122" fill="none" stroke="${accent}" stroke-opacity=".42" stroke-width="2"/>
  <path d="M80 520H1120" stroke="${accent}" stroke-width="3"/>
  <path d="M80 532H420" stroke="${previewTitleColor}" stroke-opacity=".24"/>
  <text x="80" y="92" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="3">GLOBAL AI NEWS</text>
  <text x="80" y="142" fill="#56616b" font-family="Arial, Helvetica, sans-serif" font-size="20" letter-spacing="1.5">${escapeSvg(category.toUpperCase())} / FIELD NOTE</text>
  ${titleMarkup}
  <text x="80" y="578" fill="#56616b" font-family="Arial, Helvetica, sans-serif" font-size="18">globalainews.in</text>
</svg>`;
}

export const previewTitleContrastLumaMax = 0.3;

function previewAccent(slug: string): string {
  const hash = [...slug].reduce((total, character) => total + character.charCodeAt(0), 0);
  return ['#006cff', '#b2472d', '#55704f', '#8b5e34'][hash % 4];
}

export function previewTitlePixelRegion(layout: PreviewTitleLayout): PreviewTitlePixelRegion {
  return {
    x: previewTitleX,
    y: previewTitleBaselineY - layout.fontSize,
    width: socialPreviewTitleMaxWidth,
    height: (layout.lines.length - 1) * layout.lineHeight + layout.fontSize + 16,
  };
}

export const previewTitleX = 80;

export const previewTitleBaselineY = 268;

export const previewTitleMaskFuzz = '12%';
