type MarkProps = {
  size?: number;
  mono?: boolean;
  inverted?: boolean;
};

function SignalMark({ size = 96, mono = false, inverted = false }: MarkProps) {
  const ink = inverted ? "#f6f1e7" : mono ? "#131820" : "#2055bd";
  const copper = inverted ? "#d19a73" : "#ae6c47";
  const faint = inverted ? "rgba(246,241,231,.38)" : "rgba(19,24,32,.26)";

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-label="Signal Network mark">
      <path d="M25 37.5 55 20l33 19M25 37.5l4 38L57 98l31-24.5 0-34.5M55 20l2 29M57 49 88 39M57 49l-28 26.5M57 49l0 49" stroke={faint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 37.5 57 49l31-10M57 49 57 98" stroke={ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M57 49 29 75" stroke={copper} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="25" cy="37.5" r="7" fill={ink} />
      <circle cx="57" cy="49" r="9" fill={ink} />
      <circle cx="88" cy="39" r="7" fill={copper} />
      <circle cx="29" cy="75" r="6.5" fill={copper} />
      <circle cx="57" cy="98" r="7" fill={ink} />
      <circle cx="25" cy="37.5" r="2" fill={inverted ? "#131820" : "#f6f1e7"} />
      <circle cx="57" cy="49" r="2.5" fill={inverted ? "#131820" : "#f6f1e7"} />
      <circle cx="88" cy="39" r="2" fill={inverted ? "#131820" : "#f6f1e7"} />
      <circle cx="29" cy="75" r="2" fill={inverted ? "#131820" : "#f6f1e7"} />
      <circle cx="57" cy="98" r="2" fill={inverted ? "#131820" : "#f6f1e7"} />
    </svg>
  );
}

function Wordmark({ compact = false, mono = false }: { compact?: boolean; mono?: boolean }) {
  return (
    <div className={`gan-wordmark ${compact ? "gan-wordmark-compact" : ""} ${mono ? "gan-wordmark-mono" : ""}`}>
      <span>GLOBAL</span>
      <span className={mono ? "" : "gan-blue"}>AI</span>
      <span>NEWS</span>
    </div>
  );
}

export function SignalNetwork() {
  return (
    <main className="gan-preview gan-noise min-h-[520px] overflow-hidden px-5 py-5 sm:px-8">
      <header className="flex items-start justify-between border-b gan-rule pb-4">
        <div>
          <div className="gan-mono text-[9px] uppercase tracking-[.2em] gan-blue">Logo exploration / 01</div>
          <h1 className="gan-serif mt-1 text-[22px] leading-none">Signal Network</h1>
        </div>
        <div className="max-w-[180px] text-right gan-mono text-[9px] uppercase leading-[1.45] tracking-[.13em] text-[#59616b]">
          Verified signals<br />moving through a system
        </div>
      </header>

      <section className="mt-5 grid gap-5 md:grid-cols-[1.15fr_.85fr]">
        <div className="flex min-h-[165px] items-center justify-between gap-4 bg-[#131820] px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <SignalMark size={74} inverted />
            <Wordmark />
          </div>
          <div className="hidden self-end border-l border-[#f6f1e7]/20 pl-4 gan-mono text-[8px] uppercase leading-[1.5] tracking-[.17em] text-[#f6f1e7]/55 sm:block">
            connected<br />intelligence
          </div>
        </div>
        <div className="border-l-2 border-[#2055bd] pl-4 pt-1">
          <div className="gan-mono text-[9px] uppercase tracking-[.18em] text-[#ae6c47]">Concept</div>
          <p className="gan-serif mt-2 text-[20px] leading-[1.08]">A relay, not a network diagram.</p>
          <p className="mt-3 max-w-[245px] text-[11px] leading-[1.55] text-[#59616b]">
            Five signals converge on a single editorial center, giving the mark a readable rhythm at favicon scale.
          </p>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-[1fr_1fr_1.3fr] border-t gan-rule">
        <div className="min-h-[175px] border-r gan-rule py-4 pr-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Mark only</div>
          <div className="flex h-[136px] items-center justify-center">
            <SignalMark size={112} />
          </div>
        </div>
        <div className="min-h-[175px] border-r gan-rule px-4 py-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">One color</div>
          <div className="mt-3 flex h-[96px] items-center justify-center bg-[#e5dfd3]">
            <SignalMark size={72} mono />
          </div>
          <div className="mt-3 gan-mono text-[8px] uppercase tracking-[.12em] text-[#59616b]">100% K / 0% tint</div>
        </div>
        <div className="py-4 pl-4">
          <div className="gan-mono text-[8px] uppercase tracking-[.17em] text-[#59616b]">Small-size test</div>
          <div className="mt-6 flex items-end gap-5">
            <div className="text-center">
              <SignalMark size={16} />
              <div className="mt-2 gan-mono text-[8px] text-[#59616b]">16</div>
            </div>
            <div className="text-center">
              <SignalMark size={24} />
              <div className="mt-2 gan-mono text-[8px] text-[#59616b]">24</div>
            </div>
            <div className="text-center">
              <SignalMark size={32} />
              <div className="mt-2 gan-mono text-[8px] text-[#59616b]">32</div>
            </div>
            <div className="ml-auto min-w-0">
              <Wordmark compact />
              <div className="mt-2 gan-mono text-[8px] uppercase tracking-[.11em] text-[#59616b]">header lockup</div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .gan-wordmark { display:flex; align-items:baseline; gap:.24em; color:#f6f1e7; font-family:'DM Sans',sans-serif; font-size:clamp(15px,2.5vw,24px); font-weight:700; letter-spacing:-.08em; white-space:nowrap; }
        .gan-wordmark-compact { color:#131820; font-size:12px; }
        .gan-wordmark-mono { color:#131820; }
      `}</style>
    </main>
  );
}