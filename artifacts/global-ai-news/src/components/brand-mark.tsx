import { BRAND_COLORS, editorialSealPaths } from '@/brand';

type SealProps = {
  size?: number;
  mono?: boolean;
  inverted?: boolean;
  className?: string;
  title?: string;
};

type SealGlyphProps = {
  x?: number;
  y?: number;
  size?: number;
  mono?: boolean;
  inverted?: boolean;
};

export function EditorialSealGlyph({
  x = 0,
  y = 0,
  size = 120,
  mono = false,
  inverted = false,
}: SealGlyphProps) {
  const paper = inverted ? BRAND_COLORS.ink : BRAND_COLORS.paper;
  const ink = inverted ? BRAND_COLORS.paper : mono ? BRAND_COLORS.ink : BRAND_COLORS.blue;
  const copper = inverted ? BRAND_COLORS.invertedCopper : BRAND_COLORS.copper;

  return (
    <g transform={`translate(${x} ${y}) scale(${size / 120})`}>
      <path d={editorialSealPaths.outer} fill={paper} stroke={ink} strokeWidth="2" />
      <path d={editorialSealPaths.inner} stroke={copper} strokeWidth="1.5" strokeDasharray="2 4" />
      <path d={editorialSealPaths.monogram} fill={ink} />
      <path d={editorialSealPaths.rule} stroke={copper} strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="80.5" r="3" fill={copper} />
    </g>
  );
}

export function EditorialSeal({ size = 32, mono = false, inverted = false, className, title }: SealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <EditorialSealGlyph mono={mono} inverted={inverted} />
    </svg>
  );
}

export function GlobalAiNewsLockup({
  sealSize = 30,
  mono = false,
  className = '',
}: {
  sealSize?: number;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <EditorialSeal size={sealSize} mono={mono} />
      <span className="whitespace-nowrap font-sans text-[clamp(.95rem,1.6vw,1.1rem)] font-semibold tracking-[-.07em]">
        GLOBAL <span className={mono ? '' : 'text-primary'}>AI</span> NEWS
      </span>
    </span>
  );
}