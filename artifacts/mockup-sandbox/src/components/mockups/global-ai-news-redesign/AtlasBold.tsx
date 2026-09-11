import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  CircleDot,
  Command,
  Globe2,
  Menu,
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import "./_group.css";

type Story = {
  id: string;
  kicker: string;
  title: string;
  dek: string;
  time: string;
  source: string;
  topic: string;
  zone: string;
  signal: string;
};

const stories: Story[] = [
  {
    id: "antibiotic",
    kicker: "Breakthroughs",
    title: "AI models are accelerating the hunt for new antibiotics",
    dek: "A new generation of models is moving beyond prediction — and into the wet lab.",
    time: "7 min read",
    source: "Mira Patel",
    topic: "AI",
    zone: "Labs",
    signal: "high",
  },
  {
    id: "watermarking",
    kicker: "Signals",
    title: "The quiet race to watermark everything AI makes",
    dek: "Standards are taking shape while the internet learns to ask: who made this?",
    time: "5 min read",
    source: "Jonas Rhee",
    topic: "Policy",
    zone: "Brussels",
    signal: "live",
  },
  {
    id: "india-stack",
    kicker: "India Watch",
    title: "India’s public AI stack is being built in the open",
    dek: "From language data to compute, a sovereign layer is becoming visible.",
    time: "6 min read",
    source: "Ananya Rao",
    topic: "India",
    zone: "Bengaluru",
    signal: "high",
  },
  {
    id: "small-models",
    kicker: "The Edge",
    title: "Small models are finding their way into serious workflows",
    dek: "The most useful AI may be the one that never leaves your laptop.",
    time: "4 min read",
    source: "Ishaan Mehta",
    topic: "Technology",
    zone: "Berlin",
    signal: "rising",
  },
  {
    id: "founders",
    kicker: "Field Notes",
    title: "What founders notice after their first million model calls",
    dek: "The bottleneck is rarely the model. It is the operating system around it.",
    time: "8 min read",
    source: "Lena Hoff",
    topic: "Founders",
    zone: "San Francisco",
    signal: "rising",
  },
  {
    id: "infrastructure",
    kicker: "Infrastructure",
    title: "The new geography of compute is surprisingly regional",
    dek: "Power, permits and proximity are redrawing the map of intelligence.",
    time: "9 min read",
    source: "David Okafor",
    topic: "Infrastructure",
    zone: "Lagos",
    signal: "high",
  },
];

const filters = ["All signals", "AI", "India", "Policy", "Infrastructure"];
const nodeData = [
  { id: "north-america", label: "San Francisco", detail: "Capital + frontier labs", left: "70%", top: "34%", tone: "coral" },
  { id: "europe", label: "Brussels", detail: "Watermarking standards", left: "48%", top: "27%", tone: "cyan" },
  { id: "india", label: "Bengaluru", detail: "Public AI stack", left: "68%", top: "62%", tone: "amber" },
  { id: "africa", label: "Lagos", detail: "Compute corridors", left: "37%", top: "64%", tone: "cyan" },
  { id: "east-asia", label: "Tokyo", detail: "Small model edge", left: "84%", top: "46%", tone: "coral" },
];

function StoryLink({
  story,
  children,
  className = "",
}: {
  story: Story;
  children: ReactNode;
  className?: string;
}) {
  const href = story.id === "antibiotic" ? "/article/ai-models-antibiotic-discovery" : `/topic/${story.topic.toLowerCase()}`;
  return (
    <a
      href={href}
      onClick={(event) => event.preventDefault()}
      className={className}
      aria-label={`Read ${story.title}`}
    >
      {children}
    </a>
  );
}

function AdUnit({ label = "ADVERTISEMENT", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`border border-dashed border-[#789298]/35 bg-[#0d1b20]/70 px-4 py-5 text-center ${className}`}>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9eafb0]">{label}</p>
      <p className="mt-2 text-[11px] text-[#70888c]">Independent, clearly marked inventory</p>
    </div>
  );
}

function Masthead({ onSearch }: { onSearch: (value: string) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#9db6b7]/15 bg-[#071216]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 md:px-8">
        <a href="/" onClick={(event) => event.preventDefault()} className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border border-[#70e1d0]/60 bg-[#0e2d30] text-[#70e1d0]">
            <Globe2 size={18} strokeWidth={1.5} />
          </span>
          <span className="font-sans text-[17px] font-semibold tracking-[-0.06em] text-[#eef5f0]">
            global<span className="text-[#70e1d0]">ai</span>news
          </span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          <a href="/topic/ai" onClick={(event) => event.preventDefault()} className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#a8babb] transition-colors hover:text-[#70e1d0]">Artificial intelligence</a>
          <a href="/topic/india" onClick={(event) => event.preventDefault()} className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#a8babb] transition-colors hover:text-[#f4aa67]">India Watch</a>
          <a href="#newsletter" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#a8babb] transition-colors hover:text-[#70e1d0]">The Daily Brief</a>
        </nav>
        <div className="flex items-center gap-2">
          <span className="mr-3 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-[#70888c] xl:inline">Fri · 11 Sep 2026 · UTC</span>
          <button
            type="button"
            data-testid="button-search-toggle"
            aria-label={searchOpen ? "Close search" : "Open search"}
            onClick={() => setSearchOpen((value) => !value)}
            className="grid h-9 w-9 place-items-center border border-[#9db6b7]/20 text-[#a8babb] transition-colors hover:border-[#70e1d0]/60 hover:text-[#70e1d0]"
          >
            {searchOpen ? <X size={16} /> : <Search size={16} />}
          </button>
          <a href="#newsletter" className="hidden border border-[#f4aa67]/70 bg-[#f4aa67] px-3 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#081316] sm:block">
            Join the brief
          </a>
          <button type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Open navigation" className="grid h-9 w-9 place-items-center border border-[#9db6b7]/20 text-[#a8babb] lg:hidden">
            {mobileOpen ? <X size={16} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <form onSubmit={submit} className="border-t border-[#9db6b7]/15 bg-[#0b1a1f] px-5 py-3 md:px-8">
          <div className="mx-auto flex max-w-[1440px] items-center gap-3">
            <Search size={15} className="text-[#70e1d0]" />
            <input
              data-testid="input-site-search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the intelligence atlas..."
              className="min-w-0 flex-1 bg-transparent py-2 font-mono text-xs text-[#eef5f0] outline-none placeholder:text-[#607b7e]"
            />
            <button type="submit" className="border border-[#70e1d0]/50 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#70e1d0]">Search</button>
          </div>
        </form>
      )}
      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="grid gap-1 border-t border-[#9db6b7]/15 bg-[#0b1a1f] px-5 py-3 lg:hidden">
          <a href="/topic/ai" onClick={(event) => event.preventDefault()} className="px-2 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a8babb]">Artificial intelligence</a>
          <a href="/topic/india" onClick={(event) => event.preventDefault()} className="px-2 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a8babb]">India Watch</a>
          <a href="#newsletter" className="px-2 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a8babb]">The Daily Brief</a>
        </nav>
      )}
      <div className="overflow-hidden border-t border-[#9db6b7]/15 bg-[#0e292c]">
        <div className="flex min-w-max animate-[ticker_28s_linear_infinite] gap-12 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b9d0ca] md:px-8">
          <span><b className="text-[#f4aa67]">LIVE SIGNAL</b> &nbsp; Compute moves closer to the grid</span>
          <span><b className="text-[#70e1d0]">INDIA WATCH</b> &nbsp; A public AI stack becomes visible</span>
          <span><b className="text-[#f4aa67]">POLICY</b> &nbsp; Watermarking moves from proposal to policy</span>
          <span><b className="text-[#f4aa67]">LIVE SIGNAL</b> &nbsp; Compute moves closer to the grid</span>
        </div>
      </div>
    </header>
  );
}

function Atlas({ activeNode, onNode }: { activeNode: string | null; onNode: (id: string | null) => void }) {
  return (
    <div className="relative min-h-[390px] overflow-hidden border border-[#9db6b7]/20 bg-[#09181d] md:min-h-[520px]">
      <div className="atlas-grid absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-[#9db6b7]/15 px-4 py-3 md:px-5">
        <div className="flex items-center gap-2">
          <CircleDot size={13} className="text-[#f4aa67]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#c7d7d2]">Live topology · 06:42 UTC</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#607b7e]">5 active corridors</span>
      </div>
      <svg viewBox="0 0 800 520" className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true">
        <path d="M92 220 C185 155 238 168 365 151 S545 126 696 206" fill="none" stroke="#70e1d0" strokeDasharray="2 9" strokeWidth="1.5" />
        <path d="M192 384 C280 305 339 306 436 281 S570 286 694 222" fill="none" stroke="#f4aa67" strokeDasharray="2 8" strokeWidth="1.5" />
        <path d="M370 151 C386 224 426 236 436 281 S440 369 475 426" fill="none" stroke="#70e1d0" strokeDasharray="2 8" strokeWidth="1" />
        <path d="M92 220 C126 268 156 325 192 384" fill="none" stroke="#55777c" strokeDasharray="1 10" strokeWidth="1" />
        <circle cx="365" cy="151" r="4" fill="#70e1d0" />
        <circle cx="436" cy="281" r="5" fill="#f4aa67" />
        <circle cx="192" cy="384" r="3" fill="#70e1d0" />
      </svg>
      {nodeData.map((node) => {
        const active = activeNode === node.id;
        return (
          <button
            type="button"
            key={node.id}
            aria-label={`${node.label}: ${node.detail}`}
            onMouseEnter={() => onNode(node.id)}
            onMouseLeave={() => onNode(null)}
            onFocus={() => onNode(node.id)}
            onBlur={() => onNode(null)}
            onClick={() => onNode(active ? null : node.id)}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left outline-none"
            style={{ left: node.left, top: node.top }}
          >
            <span className={`relative block h-3 w-3 rounded-full border-2 ${node.tone === "amber" ? "border-[#f4aa67] bg-[#f4aa67]" : node.tone === "coral" ? "border-[#ef806d] bg-[#ef806d]" : "border-[#70e1d0] bg-[#70e1d0]"} ${active ? "atlas-pulse" : ""}`}>
              <span className="absolute -inset-3 rounded-full border border-current opacity-0 transition-opacity group-hover:opacity-60 group-focus:opacity-60" />
            </span>
            <span className={`absolute left-5 top-[-6px] w-36 border-l border-[#9db6b7]/30 bg-[#0d2025]/95 px-3 py-2 transition-all ${active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"}`}>
              <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-[#eef5f0]">{node.label}</span>
              <span className="mt-1 block text-[10px] leading-4 text-[#8ea5a5]">{node.detail}</span>
            </span>
          </button>
        );
      })}
      <div className="absolute bottom-4 left-4 max-w-[190px] md:bottom-6 md:left-6 md:max-w-[240px]">
        <p className="font-serif text-3xl leading-[0.9] text-[#e8f0e9] md:text-4xl">The intelligence economy is redrawing itself.</p>
        <p className="mt-3 font-mono text-[9px] uppercase leading-4 tracking-[0.12em] text-[#789298]">Hover a node to read the pressure point</p>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.12em] text-[#789298] md:bottom-6 md:right-6">
        <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-[#70e1d0]" /> systems</span>
        <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-[#f4aa67]" /> India bridge</span>
      </div>
    </div>
  );
}

function SignalCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className={`group relative border-t border-[#9db6b7]/20 py-5 ${featured ? "bg-[#0d2025] p-5 md:p-7" : ""}`}>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#70e1d0]">
            <span>{story.kicker}</span>
            <span className="h-1 w-1 rounded-full bg-[#f4aa67]" />
            <span className="text-[#71898c]">{story.time}</span>
          </div>
          <StoryLink story={story} className={`mt-3 block font-semibold leading-[1.05] tracking-[-0.035em] text-[#edf3ed] transition-colors group-hover:text-[#70e1d0] ${featured ? "text-3xl md:text-[43px]" : "text-xl"}`}>
            {story.title}
          </StoryLink>
          <p className={`mt-3 max-w-2xl leading-6 text-[#92a7a6] ${featured ? "text-sm md:text-base" : "text-sm"}`}>{story.dek}</p>
          <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#607b7e]">
            <span>{story.source}</span><span className="text-[#405c60]">/</span><span>{story.zone}</span>
          </div>
        </div>
        <button
          type="button"
          data-testid={`button-bookmark-${story.id}`}
          aria-label={saved ? "Remove bookmark" : "Bookmark story"}
          onClick={() => setSaved((value) => !value)}
          className="shrink-0 border border-[#9db6b7]/20 p-2 text-[#789298] transition-colors hover:border-[#70e1d0]/60 hover:text-[#70e1d0]"
        >
          {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>
      </div>
    </article>
  );
}

function IndiaBridge() {
  const [shared, setShared] = useState(false);
  return (
    <section className="grid gap-8 border-y border-[#9db6b7]/20 py-10 md:grid-cols-[0.82fr_1.18fr] md:py-14">
      <div>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f4aa67]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f4aa67]" /> India Watch / Global bridge
        </div>
        <h2 className="mt-4 max-w-md font-serif text-5xl leading-[0.86] tracking-[-0.04em] text-[#edf3ed] md:text-6xl">A country in build mode.</h2>
        <p className="mt-5 max-w-md text-sm leading-6 text-[#92a7a6]">India’s public infrastructure, ambitious founders and policy bets are no longer a regional footnote. They are a live test of how intelligence gets distributed.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/topic/india" onClick={(event) => event.preventDefault()} className="inline-flex items-center gap-2 bg-[#f4aa67] px-4 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#081316]">Enter India Watch <ChevronRight size={14} /></a>
          <button type="button" onClick={() => setShared((value) => !value)} className="inline-flex items-center gap-2 border border-[#9db6b7]/25 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b7c8c3] hover:border-[#70e1d0]/60 hover:text-[#70e1d0]"><Share2 size={13} /> {shared ? "Link copied" : "Share bridge"}</button>
        </div>
      </div>
      <div className="relative overflow-hidden border border-[#f4aa67]/35 bg-[#15282b] p-5 md:p-7">
        <div className="absolute right-0 top-0 h-36 w-36 border-l border-b border-[#f4aa67]/20" />
        <div className="absolute right-8 top-8 h-20 w-20 rounded-full border border-[#f4aa67]/30" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.19em] text-[#f4aa67]">The bridge report / 01</p>
            <span className="font-mono text-[9px] text-[#758d8e]">BENGALURU → WORLD</span>
          </div>
          <p className="mt-14 max-w-md font-serif text-3xl leading-[0.98] text-[#eef5f0]">The public layer is becoming the competitive layer.</p>
          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#9db6b7]/20 pt-4">
            <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#758d8e]">Lens</p><p className="mt-1 text-xs text-[#d4e0da]">Language</p></div>
            <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#758d8e]">Pressure</p><p className="mt-1 text-xs text-[#d4e0da]">Compute</p></div>
            <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#758d8e]">Signal</p><p className="mt-1 text-xs text-[#f4aa67]">Visible</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (email.includes("@")) setDone(true);
  };
  return (
    <section id="newsletter" className="relative overflow-hidden border border-[#70e1d0]/30 bg-[#103338] p-6 md:p-10">
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#70e1d0]/20" />
      <div className="absolute -right-5 -top-9 h-40 w-40 rounded-full border border-[#f4aa67]/25" />
      <div className="relative grid gap-8 md:grid-cols-[1fr_0.75fr] md:items-end">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#70e1d0]">The Daily Brief · 07:30 UTC</p>
          <h2 className="mt-4 max-w-xl font-serif text-5xl leading-[0.87] tracking-[-0.04em] text-[#eff5ee] md:text-6xl">Know what moved before the room does.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#adc0ba]">One considered email for the people who need to know what changed — and why it matters.</p>
        </div>
        <div>
          {done ? (
            <div data-testid="status-newsletter-success" className="border border-[#70e1d0]/40 bg-[#082326] p-4 text-sm text-[#dff0e9]">
              <Sparkles size={16} className="mb-3 text-[#f4aa67]" />
              You’re on the list. The next signal lands tomorrow morning.
            </div>
          ) : (
            <form onSubmit={submit}>
              <label htmlFor="atlas-email" className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#789b9a]">Your work email</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input id="atlas-email" data-testid="input-newsletter-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="min-w-0 flex-1 border border-[#9db6b7]/30 bg-[#082326]/70 px-4 py-3 text-sm text-[#eef5f0] outline-none placeholder:text-[#688184] focus:border-[#70e1d0]" />
                <button data-testid="button-newsletter-submit" className="bg-[#f4aa67] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#081316]">Get the brief</button>
              </div>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#789b9a]">42,800 readers · no noise by design</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#9db6b7]/20 bg-[#050d10]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
        <div>
          <div className="font-sans text-xl font-semibold tracking-[-0.06em] text-[#eef5f0]">global<span className="text-[#70e1d0]">ai</span>news</div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#789295]">A sharper read on artificial intelligence, technology and the systems quietly changing the world around us.</p>
        </div>
        <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#70e1d0]">Explore</p><div className="mt-4 grid gap-3 text-sm text-[#b4c3be]"><a href="/topic/ai" onClick={(event) => event.preventDefault()}>Artificial intelligence</a><a href="/topic/india" onClick={(event) => event.preventDefault()}>India Watch</a><a href="#newsletter">The Daily Brief</a></div></div>
        <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#70e1d0]">Follow the desk</p><div className="mt-4 flex gap-2"><button type="button" aria-label="Share Global AI News" className="border border-[#9db6b7]/25 p-2 text-[#9aafab] hover:text-[#70e1d0]"><Share2 size={15} /></button><button type="button" aria-label="Open newsroom workspace" className="border border-[#9db6b7]/25 p-2 text-[#9aafab] hover:text-[#70e1d0]"><Command size={15} /></button></div></div>
        <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#70e1d0]">Edition</p><p className="mt-4 font-serif text-3xl text-[#eef5f0]">№254</p><p className="mt-1 text-xs text-[#789295]">Published from everywhere.</p></div>
      </div>
      <div className="border-t border-[#9db6b7]/15 px-5 py-5 md:px-8"><div className="mx-auto flex max-w-[1440px] justify-between gap-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#607a7e]"><span>© 2026 Global AI News</span><span className="hidden sm:inline">Independent newsroom · No noise by design</span></div></div>
    </footer>
  );
}

export function AtlasBold() {
  const [filter, setFilter] = useState("All signals");
  const [search, setSearch] = useState("");
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const shown = useMemo(
    () => stories.filter((story) => (filter === "All signals" || story.topic === filter) && (!search || `${story.title} ${story.dek} ${story.zone}`.toLowerCase().includes(search.toLowerCase()))),
    [filter, search],
  );
  const lead = shown[0] ?? null;

  return (
    <div className="atlas-page min-h-screen bg-[#071216] text-[#eef5f0]">
      <Masthead onSearch={setSearch} />
      <main className="mx-auto max-w-[1440px] px-5 md:px-8">
        <section className="grid gap-8 border-b border-[#9db6b7]/20 py-9 md:grid-cols-[0.86fr_1.14fr] md:py-14">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#70e1d0]"><span className="h-1.5 w-1.5 rounded-full bg-[#70e1d0] shadow-[0_0_0_4px_rgba(112,225,208,0.12)]" /> Global Intelligence Atlas / Edition №254</div>
              <h1 className="mt-6 max-w-xl font-sans text-[3.9rem] font-semibold leading-[0.86] tracking-[-0.075em] text-[#edf3ed] sm:text-7xl md:text-[6.7rem]">Read the<br /><span className="text-[#70e1d0]">change</span> in motion.</h1>
              <p className="mt-7 max-w-md text-base leading-7 text-[#92a7a6]">A live editorial map of the labs, capital, policy and infrastructure changing artificial intelligence — and the systems around it.</p>
            </div>
            <div className="mt-9 flex flex-wrap gap-2 md:mt-14" aria-label="Filter stories by desk">
              {filters.map((item) => (
                <button
                  type="button"
                  data-testid={`button-filter-${item.toLowerCase().replace(/\s/g, "-")}`}
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors ${filter === item ? "border-[#70e1d0] bg-[#70e1d0] text-[#071216]" : "border-[#9db6b7]/25 text-[#91a8a6] hover:border-[#70e1d0]/70 hover:text-[#70e1d0]"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <Atlas activeNode={activeNode} onNode={setActiveNode} />
        </section>

        <section className="grid gap-10 border-b border-[#9db6b7]/20 py-9 md:grid-cols-[1.12fr_0.88fr] md:py-12">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f4aa67]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f4aa67]" /> Deep read / {filter}</div>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#607b7e]">Updated 06:42 UTC</span>
            </div>
            {lead ? <SignalCard story={lead} featured /> : <div className="border border-dashed border-[#9db6b7]/30 p-10 text-center"><Search className="mx-auto text-[#607b7e]" /><p className="mt-3 text-sm text-[#d2ded8]">No signal found yet.</p><p className="mt-1 text-xs text-[#71898c]">Try a broader desk or another phrase.</p></div>}
            {lead && <div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#607b7e]"><ArrowDownRight size={14} className="text-[#f4aa67]" /> Why it matters: prediction is becoming part of a feedback loop.</div>}
          </div>
          <aside className="md:border-l md:border-[#9db6b7]/20 md:pl-8">
            <div className="mb-1 flex items-center justify-between"><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#70e1d0]">Signal stack</p><span className="font-mono text-[9px] text-[#607b7e]">{shown.length} LIVE</span></div>
            <div className="mt-2">{shown.slice(1, 4).map((story) => <SignalCard key={story.id} story={story} />)}</div>
            <AdUnit label="ADVERTISEMENT" className="mt-6" />
          </aside>
        </section>

        <IndiaBridge />

        <section className="grid gap-8 border-b border-[#9db6b7]/20 py-10 md:grid-cols-[0.72fr_1.28fr] md:py-14">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#70e1d0]">Follow the pressure points</p>
            <h2 className="mt-4 max-w-sm font-serif text-5xl leading-[0.88] text-[#edf3ed] md:text-6xl">The atlas is never still.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#92a7a6]">Choose a desk to trace the forces behind the headline. The map changes when the story changes.</p>
            <a href="/topic/ai" onClick={(event) => event.preventDefault()} className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#f4aa67]">View all desks <ArrowUpRight size={14} /></a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Artificial intelligence", count: "18 stories this week", href: "/topic/ai", accent: "cyan", detail: "Models, labs, products" },
              { title: "Policy & provenance", count: "12 stories this week", href: "/topic/ai", accent: "coral", detail: "Rules, standards, trust" },
              { title: "Infrastructure", count: "11 stories this week", href: "/topic/ai", accent: "amber", detail: "Power, chips, compute" },
              { title: "Founders & capital", count: "9 stories this week", href: "/topic/ai", accent: "cyan", detail: "Companies, conviction" },
            ].map((desk) => (
              <a key={desk.title} href={desk.href} onClick={(event) => event.preventDefault()} className="group relative min-h-[170px] overflow-hidden border border-[#9db6b7]/20 bg-[#0c1d22] p-5 transition-transform hover:-translate-y-1">
                <span className={`absolute right-4 top-4 h-2 w-2 rounded-full ${desk.accent === "amber" ? "bg-[#f4aa67]" : desk.accent === "coral" ? "bg-[#ef806d]" : "bg-[#70e1d0]"}`} />
                <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#607b7e]">Desk 0{desk.title.length % 4 + 1}</span>
                <p className="mt-10 max-w-[190px] text-xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#e8f0e9] group-hover:text-[#70e1d0]">{desk.title}</p>
                <p className="mt-3 text-[11px] text-[#789295]">{desk.detail} · {desk.count}</p>
                <ArrowUpRight size={16} className="absolute bottom-5 right-5 text-[#f4aa67] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </section>

        <div className="py-10 md:py-14"><Newsletter /></div>
      </main>
      <Footer />
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-38%); } }
        @keyframes atlasPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(112,225,208,.4); } 50% { box-shadow: 0 0 0 10px rgba(112,225,208,0); } }
        .atlas-pulse { animation: atlasPulse 1.8s ease-in-out infinite; }
        .atlas-grid {
          background-image: linear-gradient(rgba(112,225,208,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(112,225,208,.09) 1px, transparent 1px), radial-gradient(circle at 50% 43%, rgba(112,225,208,.12), transparent 42%);
          background-size: 44px 44px, 44px 44px, 100% 100%;
        }
        .atlas-page button, .atlas-page a { -webkit-tap-highlight-color: transparent; }
        @media (prefers-reduced-motion: reduce) {
          .atlas-page *, .atlas-page *::before, .atlas-page *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
        }
      `}</style>
    </div>
  );
}
