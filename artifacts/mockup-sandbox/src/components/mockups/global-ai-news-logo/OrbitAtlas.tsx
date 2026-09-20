type OrbitProps = {
  size?: number;
  mono?: boolean;
  inverted?: boolean;
};

function OrbitAtlasMark({ size = 110, mono = false, inverted = false }: OrbitProps) {
  const ink = inverted ? "#f6f1e7" : mono ? "#131820" : "#2055bd";
  const copper = inverted ? "#d19a73" : "#ae6c47";
  const haze = inverted ? "rgba(246,241,231,.28)" : "rgba(19,24,32,.24)";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-label="Orbit Atlas mark">
      <path d="M15 67c7-30 34-48 61-43 20 4 31 19 29 33-2 17-20 28-42 33-24 6-46 2-49-10-1.5-4.5-1-9.2 1-13.5Z" stroke={haze} strokeWidth="2" />
      <path d="M24 38c17-13 43-17 61-8 21 10 27 29 18 43-8 12-28 17-47 13-16-3-28-12-31-24" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M28 87c14 8 35 10 54 2 15-6 25-17 26-28" stroke={copper} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M19 58c17 5 37 5 55-3 15-6 25-15 29-25" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <circle cx="57" cy="56" r="14" fill={ink} />
      <circle cx="57" cy="56" r="5" fill={inverted ? "#131820" : "#f6f1e7"} />
      <circle cx="98" cy="35" r="5.5" fill={copper} />
      <circle cx="27" cy="87" r="4.5" fill={ink} />
    </svg>
  );
}

function AtlasWordmark({ mono = false, inverted = false }: { mono?: boolean; inverted?: boolean }) {
  return (
    <div className="flex items-baseline gap-[.22em] whitespace-nowrap font-['DM_Sans'] text-[clamp(16px,2.8vw,26px)] font-semibold tracking-[-.08em]">
      <span>GLOBAL</span><span className={mono || inverted ? "" : "text-[#2055bd]"}>AI</span><span>NEWS</span>
    </div>
  );
}

export function OrbitAtlas() {
  return (
    <main className="gan-preview min-h-[520px] overflow-hidden bg-[#f7f0e5] px-5 py-5 sm:px-8">
      <header className="flex items-start justify-between border-b border-[#131820]/20 pb-4">
        <div>
          <div className="gan-mono text-[9px] uppercase tracking-[.2em] text-[#2055bd]">Logo exploration / 03</div>
          <h1 className="gan-serif mt-1 text-[22px] leading-none">Orbit Atlas</h1>
        </div>
        <div className="max-w-[190px] text-right gan-mono text-[9px] uppercase leading-[1.45] tracking-[.13em] text-[#59616b]">
          Global coverage,<br />held in context
        </div>
      </header>

      <section className="mt-5 grid gap-5 md:grid-cols-[1.2fr_.8fr]">
        <div className="relative flex min-h-[172px] items-center overflow-hidden bg-[#2055bd] px-5 py-5 text-[#f6f1e7] sm:px-7">
          <div className="absolute -right-5 -top-14 opacity-40"><OrbitAtlasMark size={230} inverted /></div>
          <div className="relative z-10 flex items-center gap-4">
            <OrbitAtlasMark size={78} inverted />
            <div>
              <AtlasWordmark inverted />
              <div className="mt-2 gan-mono text-[8px] uppercase tracking-[.2em] text-[#f6f1e7]/65">world / systems / context</div>
            </div>
          </div>
        </div>
        <div className="border-l-2 border-[#ae6c47] pl-4 pt-1">
          <div className="gan-mono text-[9px] uppercase tracking-[.18em] text-[#ae6c47]">Concept</div>
          <p className="gan-serif mt-2 text-[20px] leading-[1.08]">A world without a map.</p>
          <p className="mt-3 max-w-[245px] text-[11px] leading-[1.55] text-[#59616b]">
            Layered orbits turn the planet into a system of relationships, with one editorial center and a live perimeter.
          </p>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-[1fr_1fr_1.3fr] border-t border-[#131820]/20">
        <div className="border-r border-[#131820]/20 py-4 pr-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Mark only</div>
          <div className="flex h-[136px] items-center justify-center"><OrbitAtlasMark size={112} /></div>
        </div>
        <div className="border-r border-[#131820]/20 px-4 py-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Monochrome</div>
          <div className="mt-3 flex h-[96px] items-center justify-center bg-[#e4ddd1]"><OrbitAtlasMark size={72} mono /></div>
          <div className="mt-3 gan-mono text-[8px] uppercase tracking-[.12em] text-[#59616b]">black on warm ivory</div>
        </div>
        <div className="py-4 pl-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Small-size test</div>
          <div className="mt-6 flex items-end gap-5">
            <div className="text-center"><OrbitAtlasMark size={16} /><div className="mt-2 gan-mono text-[8px] text-[#59616b]">16</div></div>
            <div className="text-center"><OrbitAtlasMark size={24} /><div className="mt-2 gan-mono text-[8px] text-[#59616b]">24</div></div>
            <div className="text-center"><OrbitAtlasMark size={32} /><div className="mt-2 gan-mono text-[8px] text-[#59616b]">32</div></div>
            <div className="ml-auto"><AtlasWordmark /><div className="mt-2 gan-mono text-[8px] uppercase tracking-[.11em] text-[#59616b]">responsive lockup</div></div>
          </div>
        </div>
      </section>
    </main>
  );
}