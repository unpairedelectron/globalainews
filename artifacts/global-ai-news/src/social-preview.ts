export const socialPreviewWidth = 1200;
export const socialPreviewHeight = 630;
export const socialPreviewTitleMaxWidth = 1040;

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

const previewTitleStyles: PreviewTitleStyle[] = [
  { maxCharacters: 34, fontSize: 54, lineHeight: 66, maxLines: 3 },
  { maxCharacters: 40, fontSize: 46, lineHeight: 56, maxLines: 4 },
  { maxCharacters: 46, fontSize: 40, lineHeight: 48, maxLines: 5 },
  { maxCharacters: 54, fontSize: 34, lineHeight: 42, maxLines: 6 },
  { maxCharacters: 61, fontSize: 30, lineHeight: 38, maxLines: 7 },
];

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