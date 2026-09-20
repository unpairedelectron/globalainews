type SealProps = {
  size?: number;
  mono?: boolean;
  inverted?: boolean;
};

function EditorialSeal({ size = 112, mono = false, inverted = false }: SealProps) {
  const paper = inverted ? "#131820" : "#f6f1e7";
  const ink = inverted ? "#f6f1e7" : mono ? "#131820" : "#2055bd";
  const copper = inverted ? "#d19a73" : "#ae6c47";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-label="GAN editorial seal">
      <path d="M60 7 101 31v47l-41 25L19 78V31L60 7Z" fill={paper} stroke={ink} strokeWidth="2" />
      <path d="M60 13 95 34v40L60 95 25 74V34L60 13Z" stroke={copper} strokeWidth="1.5" strokeDasharray="2 4" />
      <path d="M40 49.5c0-9.4 6.8-16 17.5-16 8.3 0 14.3 3.3 17.6 9.1l-7.4 4.7c-1.9-3.3-5.1-5.3-9.7-5.3-5.9 0-9.8 3-9.8 7.7s3.4 7.6 10.3 7.6h4v-4.1h-6.8v-6.8h15.5v18.3H60.5v-3.2c-2.3 2.7-5.6 4.1-10 4.1-6.9 0-10.5-5.1-10.5-16Z" fill={ink} />
      <path d="M44 80.5h32" stroke={copper} strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="80.5" r="3" fill={copper} />
    </svg>
  );
}

function ImprintWordmark({ mono = false }: { mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-[.22em] whitespace-nowrap font-['DM_Sans'] text-[clamp(18px,3vw,28px)] font-semibold tracking-[-.08em]">
      <span>GLOBAL</span><span className={mono ? "" : "text-[#2055bd]"}>AI</span><span>NEWS</span>
    </div>
  );
}

export function EditorialMonogram() {
  return (
    <main className="gan-preview min-h-[520px] overflow-hidden bg-[#f1eadc] px-5 py-5 sm:px-8">
      <header className="flex items-start justify-between border-b border-[#131820]/20 pb-4">
        <div>
          <div className="gan-mono text-[9px] uppercase tracking-[.2em] text-[#ae6c47]">Logo exploration / 02</div>
          <h1 className="gan-serif mt-1 text-[22px] leading-none">Editorial Monogram</h1>
        </div>
        <div className="max-w-[180px] text-right gan-mono text-[9px] uppercase leading-[1.45] tracking-[.13em] text-[#59616b]">
          An imprint for<br />the permanent record
        </div>
      </header>

      <section className="mt-5 grid items-center gap-6 md:grid-cols-[.9fr_1.1fr]">
        <div className="flex min-h-[182px] items-center justify-center border border-[#131820]/20 bg-[#f6f1e7]">
          <EditorialSeal size={154} />
        </div>
        <div>
          <div className="gan-mono text-[9px] uppercase tracking-[.18em] text-[#2055bd]">Concept</div>
          <p className="gan-serif mt-2 max-w-[320px] text-[25px] leading-[1.05]">A compact mark of editorial trust.</p>
          <p className="mt-3 max-w-[315px] text-[11px] leading-[1.55] text-[#59616b]">
            The GAN monogram becomes a repeatable publication stamp—clear enough for a browser tab, considered enough for a printed dossier.
          </p>
          <div className="mt-5 flex items-center gap-3 border-t border-[#131820]/15 pt-3">
            <span className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#ae6c47]">GAN / 26</span>
            <span className="h-px w-8 bg-[#ae6c47]" />
            <span className="gan-mono text-[8px] uppercase tracking-[.12em] text-[#59616b]">est. for the record</span>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-[1.1fr_1fr_1.35fr] border-t border-[#131820]/20">
        <div className="border-r border-[#131820]/20 py-4 pr-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Full lockup</div>
          <div className="mt-6 flex items-center gap-3">
            <EditorialSeal size={44} />
            <ImprintWordmark />
          </div>
          <div className="mt-5 gan-mono text-[8px] uppercase tracking-[.11em] text-[#59616b]">publication imprint</div>
        </div>
        <div className="border-r border-[#131820]/20 px-4 py-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Monochrome</div>
          <div className="mt-3 flex h-[96px] items-center justify-center bg-[#ded6c7]">
            <EditorialSeal size={72} mono />
          </div>
          <div className="mt-3 gan-mono text-[8px] uppercase tracking-[.12em] text-[#59616b]">one-color seal</div>
        </div>
        <div className="py-4 pl-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Favicon / badge test</div>
          <div className="mt-5 flex items-end gap-5">
            <div className="text-center"><EditorialSeal size={16} mono /><div className="mt-2 gan-mono text-[8px] text-[#59616b]">16</div></div>
            <div className="text-center"><EditorialSeal size={24} /><div className="mt-2 gan-mono text-[8px] text-[#59616b]">24</div></div>
            <div className="text-center"><EditorialSeal size={34} /><div className="mt-2 gan-mono text-[8px] text-[#59616b]">34</div></div>
            <div className="ml-auto flex h-12 w-12 items-center justify-center border border-[#131820]/25"><EditorialSeal size={40} /></div>
          </div>
        </div>
      </section>
    </main>
  );
}