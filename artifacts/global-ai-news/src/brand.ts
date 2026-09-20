export const BRAND_COLORS = {
  paper: '#f6f1e7',
  ink: '#131820',
  blue: '#2055bd',
  copper: '#ae6c47',
  invertedCopper: '#d19a73',
} as const;

export const editorialSealPaths = {
  outer: 'M60 7 101 31v47l-41 25L19 78V31L60 7Z',
  inner: 'M60 13 95 34v40L60 95 25 74V34L60 13Z',
  monogram: 'M40 49.5c0-9.4 6.8-16 17.5-16 8.3 0 14.3 3.3 17.6 9.1l-7.4 4.7c-1.9-3.3-5.1-5.3-9.7-5.3-5.9 0-9.8 3-9.8 7.7s3.4 7.6 10.3 7.6h4v-4.1h-6.8v-6.8h15.5v18.3H60.5v-3.2c-2.3 2.7-5.6 4.1-10 4.1-6.9 0-10.5-5.1-10.5-16Z',
  rule: 'M44 80.5h32',
} as const;

export interface EditorialSealSvgOptions {
  x?: number;
  y?: number;
  size?: number;
  mono?: boolean;
  inverted?: boolean;
}

export function editorialSealSvgMarkup({
  x = 0,
  y = 0,
  size = 120,
  mono = false,
  inverted = false,
}: EditorialSealSvgOptions = {}): string {
  const paper = inverted ? BRAND_COLORS.ink : BRAND_COLORS.paper;
  const ink = inverted ? BRAND_COLORS.paper : mono ? BRAND_COLORS.ink : BRAND_COLORS.blue;
  const copper = inverted ? BRAND_COLORS.invertedCopper : BRAND_COLORS.copper;
  const scale = size / 120;

  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="${editorialSealPaths.outer}" fill="${paper}" stroke="${ink}" stroke-width="2"/>
    <path d="${editorialSealPaths.inner}" stroke="${copper}" stroke-width="1.5" stroke-dasharray="2 4"/>
    <path d="${editorialSealPaths.monogram}" fill="${ink}"/>
    <path d="${editorialSealPaths.rule}" stroke="${copper}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="60" cy="80.5" r="3" fill="${copper}"/>
  </g>`;
}