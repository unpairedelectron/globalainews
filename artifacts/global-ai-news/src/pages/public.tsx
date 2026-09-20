import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Pencil, Plus, RefreshCw, Search, Share2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Show, useClerk, useUser } from '@clerk/react';
import { Link, useLocation, useParams } from 'wouter';
import { askGlobalAnswers, authors, entities, essays, filterSignals, findEntity, findStory, findTimeline, indiaIndex, industryMap, signals, sources, stories, timelineEvents, type Story } from '@/content';
import { EditorialImage, EntityLinks, EvidencePanel, Footer, Header, Newsletter, SectionLabel, SeoHead, StoryRow, TimelineList } from '@/components/site';
import { BRAND_COLORS } from '@/brand';
import { EditorialSealGlyph } from '@/components/brand-mark';
import { useNewsroomSnapshot } from '@/newsroom';
import { layoutPreviewTitle, socialPreviewAccent, socialPreviewFooterY, socialPreviewHeight, socialPreviewTitleStartY, socialPreviewTitleX, socialPreviewWidth } from '@/social-preview';
import {
  EditorialReleaseHistoryAction,
  getGetNewsroomReleaseHistoryQueryKey,
  getGetNewsroomReleasesQueryKey,
  useCancelNewsroomRelease,
  useCreateNewsroomRelease,
  useGetNewsroomReleaseHistory,
  useGetNewsroomReleases,
  useReorderNewsroomReleases,
  useUpdateNewsroomRelease,
  type EditorialRelease,
  type EditorialReleaseHistoryAction as EditorialReleaseHistoryActionType,
  type EditorialReleaseInput,
  type EditorialReleaseUpdate,
} from '@workspace/api-client-react';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const container = 'mx-auto max-w-[1440px] px-5 md:px-10';

function Shell({ children }: { children: ReactNode }) { return <><Header />{children}<Footer /></>; }
function storyHref(slug: string) { return `/article/${findStory(slug)?.slug ?? slug}`; }
function formatScheduleTime(publishAt: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date(publishAt)).replace(',', '') + ' UTC';
}
function formatHistoryTime(createdAt: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date(createdAt)).replace(',', '') + ' UTC';
}

export function HomePage() {
  return <Shell><SeoHead title="Global AI News — Intelligence for the AI economy" description="Stories, signals and context for understanding the AI industry." path="/" /><main className={container}>
    <section className="grid gap-10 border-b border-foreground/20 py-14 md:grid-cols-[.78fr_1.22fr] md:py-24"><div className="flex flex-col justify-between"><div><p className="eyebrow text-primary">Global AI News · Edition 254</p><h1 className="mt-7 max-w-3xl font-serif text-[4rem] leading-[.82] tracking-[-.04em] sm:text-7xl md:text-[8.2rem]">Understand<br /><em className="text-primary">what changed.</em></h1><p className="mt-8 max-w-md text-lg leading-7 text-muted-foreground">The place to understand the AI industry — through stories, signals, evidence and context.</p></div><div className="mt-12 grid grid-cols-2 gap-4 border-t border-foreground/15 pt-4 text-xs sm:grid-cols-3"><span><b className="block text-2xl font-serif">08</b> desks in motion</span><span><b className="block text-2xl font-serif">24h</b> editorial pulse</span><span><b className="block text-2xl font-serif">01</b> clear signal</span></div></div><div className="min-h-[360px] border border-foreground/15 bg-[#e4e9ef] p-5 md:min-h-[540px]"><div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-primary"><span>Live intelligence / global</span><span>06:42 UTC</span></div><div className="relative mt-8 h-[280px] border-b border-l border-foreground/20 md:h-[400px]"><div className="absolute left-[16%] top-[30%] h-px w-[67%] rotate-[18deg] bg-primary/60" /><div className="absolute left-[18%] top-[48%] h-px w-[60%] rotate-[-13deg] bg-primary/40" /><div className="absolute left-[14%] top-[33%] h-3 w-3 rounded-full bg-primary" /><div className="absolute left-[48%] top-[21%] h-3 w-3 rounded-full bg-accent" /><div className="absolute left-[72%] top-[56%] h-3 w-3 rounded-full bg-primary" /><div className="absolute bottom-5 left-5 max-w-xs"><p className="font-serif text-4xl leading-[.9] md:text-5xl">The industry is moving fast. We make sense of it.</p><p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Select a desk to trace the pressure point</p></div></div></div></section>
     <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[1.2fr_.8fr] md:py-16"><div><SectionLabel aside="Lead story · 7 min">Today’s lead</SectionLabel><Link href="/article/ai-models-antibiotic-discovery" className="group block"><EditorialImage large alt="Abstract map of molecular structures and laboratory notes" caption="The interface between a model’s search and the laboratory is becoming more precise." /><p className="eyebrow mt-7 text-primary">Breakthroughs</p><h2 className="mt-3 max-w-3xl font-serif text-5xl leading-[.88] transition-colors group-hover:text-primary md:text-7xl">AI models are accelerating the hunt for new antibiotics</h2><p className="mt-5 max-w-2xl text-lg leading-7 text-muted-foreground">A new generation of models is moving beyond prediction — and into the wet lab.</p></Link></div><aside><SectionLabel aside="6 live">Today’s signals</SectionLabel>{signals.slice(0, 4).map((signal) => <Link data-testid={`link-home-signal-${signal.slug}`} href="/signals" key={signal.slug} className="block border-b border-foreground/15 py-5 first:pt-0 hover:text-primary"><div className="flex justify-between"><span className="eyebrow">{signal.label}</span><span className="font-mono text-xs text-primary">{signal.change}</span></div><p className="mt-2 text-lg leading-tight">{signal.summary}</p></Link>)}</aside></section>
    <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.75fr_1.25fr] md:py-16"><div><SectionLabel>Top stories</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">The useful read, not the loudest read.</h2><Link href="/brief" className="mt-8 inline-flex border-b border-primary pb-2 text-sm text-primary">Read the Daily Brief <ArrowUpRight size={14} className="ml-2" /></Link></div><div>{stories.slice(1, 5).map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}</div></section>
    <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.65fr_1.35fr] md:py-16"><div><SectionLabel>What changed today</SectionLabel><h2 className="font-serif text-5xl leading-[.9]">A timeline for the moving parts.</h2></div><TimelineList slugs={timelineEvents.slice(0, 5).map((event) => event.slug)} /></section>
    <section className="grid gap-8 border-b border-foreground/20 py-12 md:grid-cols-[.55fr_1.45fr] md:py-16"><div><SectionLabel>Industry map</SectionLabel><h2 className="font-serif text-5xl leading-[.9]">The ecosystem, connected.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Frontier labs, infrastructure, models, capital and policy — related, but not interchangeable.</p><Link href="/industry" className="mt-7 inline-flex border-b border-primary pb-2 text-sm text-primary">Enter the map <ArrowUpRight size={14} className="ml-2" /></Link></div><div className="grid gap-px border border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">{['Frontier Labs', 'Infrastructure', 'Models', 'Agents', 'Applications', 'Capital', 'Policy', 'India'].map((layer, index) => <Link href={layer === 'India' ? '/india' : '/industry'} key={layer} className="bg-background p-5 transition-colors hover:bg-primary hover:text-primary-foreground"><span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span><p className="mt-10 text-lg">{layer}</p><p className="mt-2 text-xs opacity-60">{industryMap.filter((node) => node.layer === layer).length || index + 2} pressure points</p></Link>)}</div></section>
    <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[1fr_1fr] md:py-16"><div><SectionLabel>India AI Index</SectionLabel><h2 className="font-serif text-6xl leading-[.86]">A country in build mode.</h2><p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">Startups, public compute, language data and policy — India is building a distinct layer of the AI economy.</p><Link href="/india" className="mt-7 inline-flex bg-foreground px-4 py-3 text-xs text-background">Open India AI Index <ArrowUpRight size={14} className="ml-2" /></Link></div><div className="border-l border-foreground/15 pl-6 md:pl-10">{indiaIndex.slice(0, 4).map((metric) => <div key={metric.slug} className="grid grid-cols-[1fr_auto] border-b border-foreground/15 py-4"><span className="text-sm">{metric.label}<small className="mt-1 block text-xs text-muted-foreground">{metric.context}</small></span><strong className="font-serif text-3xl">{metric.value}</strong></div>)}</div></section>
    <section className="py-12 md:py-16"><SectionLabel>Deep reads</SectionLabel><div className="grid gap-8 md:grid-cols-[1.2fr_.8fr]"><div><p className="eyebrow text-primary">Essay / {essays[0].readTime}</p><Link href="/essays" className="mt-3 block font-serif text-5xl leading-[.88] hover:text-primary md:text-7xl">{essays[0].title}</Link><p className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground">{essays[0].dek}</p></div><div className="border-t border-foreground/15 pt-5">{essays.slice(1).map((essay) => <Link href="/essays" key={essay.slug} className="block border-b border-foreground/15 py-4 text-lg hover:text-primary">{essay.title}<span className="mt-2 block text-xs text-muted-foreground">{essay.author} · {essay.readTime}</span></Link>)}</div></div></section><Newsletter /></main></Shell>;
}

export function BriefPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split('?')[1] ?? '').get('q') ?? '';
  const results = useMemo(() => query ? stories.filter((story) => `${story.title} ${story.dek} ${story.category}`.toLowerCase().includes(query.toLowerCase())) : stories, [query]);
  return <Shell><SeoHead title="The Daily Brief — Global AI News" description="A three-minute editorial briefing on what changed across the AI economy." path="/brief" /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Friday · 11 September 2026 · 07:30 UTC</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">The Daily<br /><em className="text-primary">Brief.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">A three-minute read on the decisions, releases and quiet shifts changing the AI industry.</p></section>{query && <section className="border-b border-foreground/15 py-6"><p className="eyebrow text-primary">Search results for “{query}”</p>{results.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No result yet. Try an entity, desk or story title.</p>}</section>}<section className="grid gap-12 py-12 md:grid-cols-[1fr_280px]"><article>{results.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}</article><aside className="md:border-l md:border-foreground/15 md:pl-7"><SectionLabel>In this edition</SectionLabel><div className="grid gap-3 text-sm">{['What changed', 'The model race', 'India’s public layer', 'Evidence to watch', 'What comes next'].map((item, index) => <a href={`#brief-${index}`} key={item} className="border-b border-foreground/15 pb-3 hover:text-primary">0{index + 1} / {item}</a>)}</div><div className="mt-10 border-t border-foreground/15 pt-5"><p className="eyebrow text-muted-foreground">Editor’s note</p><p className="mt-3 text-sm leading-6">We separate reported fact, analysis and synthesis so you can move quickly without losing the thread.</p></div></aside></section><Newsletter compact /></main></Shell>;
}

export function SignalsPage() {
  const [topic, setTopic] = useState('All signals');
  const topics = ['All signals', 'Models', 'Infrastructure', 'Capital', 'Policy', 'Applications'];
  const visible = topic === 'All signals' ? signals : filterSignals(topic);
 return <Shell><SeoHead title="Signals — Global AI News" description="Directional intelligence across the AI economy." path="/signals" /><main className={container}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Directional intelligence · updated 06:42 UTC</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">Signals<br /><em className="text-primary">in motion.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">The meaningful direction beneath the headlines: model race, infrastructure, capital, regulation, open source and enterprise adoption.</p></section><div className="flex flex-wrap gap-2 border-b border-foreground/15 py-5">{topics.map((item) => <button data-testid={`button-signal-filter-${item.toLowerCase().replace(/\s/g, '-')}`} type="button" key={item} onClick={() => setTopic(item)} className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${topic === item ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20 hover:border-primary'}`}>{item}</button>)}</div><section className="grid gap-px border-x border-foreground/15 bg-foreground/15 md:grid-cols-2 lg:grid-cols-3">{visible.map((signal) => <article data-testid={`card-signal-${signal.slug}`} key={signal.slug} className="bg-background p-6 md:p-8"><div className="flex items-center justify-between"><p className="eyebrow text-primary">{signal.label}</p><span className="font-mono text-sm text-primary">{signal.change}</span></div><div className="mt-7 flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-primary" /><span className="font-serif text-2xl">{signal.direction === 'up' ? 'Moving up' : signal.direction === 'down' ? 'Moving down' : 'Holding'}</span></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{signal.summary}</p><div className="mt-8 border-t border-foreground/15 pt-4"><p className="eyebrow text-muted-foreground">Impact · {signal.impact}</p><div className="mt-3 flex flex-wrap gap-3 text-xs">{signal.entities.slice(0, 3).map((slug) => { const entity = findEntity(slug); return entity ? <Link href={`/${entity.kind}/${slug}`} key={slug} className="hover:text-primary">{entity.name}</Link> : null; })}</div></div></article>)}</section><section className="grid gap-10 py-14 md:grid-cols-[.8fr_1.2fr]"><div><SectionLabel>Read the evidence</SectionLabel><h2 className="font-serif text-5xl leading-[.9]">Signals are not predictions.</h2></div><div><p className="max-w-2xl text-lg leading-8">Each signal is tied to a story, entity and source. Direction is editorial judgement; the underlying record stays visible.</p><div className="mt-7">{visible.slice(0, 3).map((signal) => <Link href={storyHref(signal.stories[0])} key={signal.slug} className="flex justify-between border-t border-foreground/15 py-4 text-sm hover:text-primary"><span>{signal.label}</span><ArrowUpRight size={14} /></Link>)}</div></div></section></main></Shell>;
}

export function ResearchPage({ essay = false }: { essay?: boolean }) {
  const list = essay ? essays : stories.filter((story) => ['Breakthroughs', 'Field Notes', 'Infrastructure'].includes(story.category));
  return <Shell><SeoHead title={`${essay ? 'Essays' : 'Research & context'} — Global AI News`} description="Context for the AI economy." path={essay ? '/essays' : '/research'} /><main className={container}><section className="grid gap-8 border-b border-foreground/20 py-14 md:grid-cols-[1fr_300px] md:py-20"><div><p className="eyebrow text-primary">{essay ? 'Long-form desk' : 'Research desk'}</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[8rem]">{essay ? 'Essays.' : <>Context<br /><em className="text-primary">over noise.</em></>}</h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">{essay ? 'Arguments and field notes about what the AI industry is becoming.' : 'Research, analysis and explanatory work for readers who need the second-order view.'}</p></div><div className="border-t border-foreground/15 pt-4 text-sm leading-6 text-muted-foreground">Our desks distinguish reported facts, analysis, opinion and AI-assisted synthesis. The label is part of the reading experience.</div></section><section className="grid gap-10 py-12 md:grid-cols-[1.15fr_.85fr]"><div>{essay ? list.map((item) => <article key={item.slug} className="border-t border-foreground/15 py-7"><p className="eyebrow text-primary">Essay · {item.readTime}</p><Link href="/essays" className="mt-3 block max-w-3xl font-serif text-4xl leading-[.9] hover:text-primary">{item.title}</Link><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{item.dek}</p><p className="mt-5 text-xs text-muted-foreground">By {item.author} · {item.date}</p></article>) : list.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}</div><aside><SectionLabel>Entry points</SectionLabel>{['Model evaluation', 'AI in science', 'The infrastructure map', 'Public AI systems'].map((item, index) => <div key={item} className="border-b border-foreground/15 py-4 text-sm"><span className="mr-3 font-mono text-primary">0{index + 1}</span>{item}</div>)}<div className="mt-12"><Newsletter compact /></div></aside></section></main></Shell>;
}

export function IndustryPage() {
  const [layer, setLayer] = useState('All');
  const layers = ['All', 'Frontier Labs', 'Infrastructure', 'Models', 'Agents', 'Applications', 'Capital', 'Policy'];
  const nodes = layer === 'All' ? industryMap : industryMap.filter((node) => node.layer === layer);
  return <Shell><SeoHead title="AI Industry Map — Global AI News" description="A structured view of the AI ecosystem." path="/industry" /><main className={container}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Industry intelligence · 07 layers</p><h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">The AI<br /><em className="text-primary">industry map.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">See the relationships between frontier labs, infrastructure, models, agents, applications, capital and policy.</p></section><div className="flex flex-wrap gap-2 border-b border-foreground/15 py-5">{layers.map((item) => <button data-testid={`button-industry-${item.toLowerCase().replace(/\s/g, '-')}`} type="button" key={item} onClick={() => setLayer(item)} className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${layer === item ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20 hover:border-primary'}`}>{item}</button>)}</div><section className="relative min-h-[440px] border border-foreground/15 bg-[#e4e9ef] p-6 md:min-h-[620px]"><div className="absolute inset-8 border border-primary/20" /><div className="absolute left-[15%] top-[24%] h-px w-[70%] rotate-[12deg] bg-primary/50" /><div className="absolute left-[21%] top-[60%] h-px w-[58%] rotate-[-9deg] bg-primary/40" />{nodes.map((node) => <Link data-testid={`link-industry-node-${node.slug}`} href="/industry" key={node.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${node.x}%`, top: `${node.y}%` }}><span className="block h-4 w-4 rounded-full border-2 border-primary bg-background hover:bg-primary" /><span className="mt-2 block w-28 text-center text-[10px] leading-3">{node.name}</span></Link>)}<div className="absolute bottom-6 left-6 max-w-sm"><p className="font-serif text-4xl leading-[.9]">Every layer changes the pressure on the next.</p><p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{nodes.length} nodes · {layer}</p></div></section><section className="grid gap-px border-x border-b border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-3">{nodes.map((node) => <article key={node.slug} className="bg-background p-6"><p className="eyebrow text-primary">{node.layer}</p><h2 className="mt-3 text-xl">{node.name}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{node.description}</p><p className="mt-5 border-t border-foreground/15 pt-3 text-xs"><b>Pressure:</b> {node.pressure}</p></article>)}</section></main></Shell>;
}

export function FocusIndexPage({ kind }: { kind: 'models' | 'policy' }) {
  const isModels = kind === 'models';
  const list = isModels ? entities.filter((entity) => entity.kind === 'model') : entities.filter((entity) => entity.kind === 'policy' || entity.slug === 'content-credentials');
  return <Shell><SeoHead title={`${isModels ? 'Models' : 'Policy'} intelligence — Global AI News`} description={`Focused ${kind} intelligence.`} path={`/${kind}`} /><main className={container}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">{isModels ? 'Model intelligence' : 'Policy intelligence'}</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{isModels ? <>Models<br /><em className="text-primary">in practice.</em></> : <>Policy<br /><em className="text-primary">in motion.</em></>}</h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">{isModels ? 'Capabilities, deployment economics and the systems behind the benchmark.' : 'Rules, standards and public infrastructure that make the AI economy legible.'}</p></section><section className="grid gap-12 py-12 md:grid-cols-[.7fr_1.3fr]"><div><SectionLabel>Focused index</SectionLabel><p className="max-w-sm text-sm leading-6 text-muted-foreground">Profiles are linked to stories, signals and timelines so the record stays connected.</p></div><div className="grid gap-px border bg-foreground/15 sm:grid-cols-2">{list.map((entity) => <Link href={`/${entity.kind}/${entity.slug}`} key={entity.slug} className="bg-background p-7 hover:bg-primary hover:text-primary-foreground"><p className="eyebrow opacity-60">{entity.kind}</p><h2 className="mt-10 font-serif text-3xl leading-none">{entity.name}</h2><p className="mt-3 text-sm opacity-70">{entity.strapline}</p></Link>)}</div></section></main></Shell>;
}

export function IndiaPage() {
  return <Shell><SeoHead title="India AI Index — Global AI News" description="India’s startups, funding, talent, research, policy and public AI infrastructure." path="/india" /><main className={container}><section className="grid gap-10 border-b border-foreground/20 py-14 md:grid-cols-[1fr_.7fr] md:py-20"><div><p className="eyebrow text-primary">Regional intelligence · India</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">India<br /><em className="text-primary">in build mode.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">A differentiated view of the companies, talent, public infrastructure and policy bets shaping India’s AI economy.</p></div><div className="border-l border-foreground/15 pl-6 md:pl-10"><p className="eyebrow text-muted-foreground">Index thesis</p><p className="mt-5 font-serif text-3xl leading-none">The public layer is becoming the competitive layer.</p></div></section><section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.55fr_1.45fr]"><div><SectionLabel>Index metrics</SectionLabel><p className="text-sm leading-6 text-muted-foreground">Updated across startups, funding, talent, research, policy, infrastructure, companies and government initiatives.</p></div><div className="grid gap-px border bg-foreground/15 sm:grid-cols-2">{indiaIndex.map((metric) => <div data-testid={`metric-india-${metric.slug}`} key={metric.slug} className="bg-background p-6"><p className="eyebrow text-primary">{metric.label}</p><p className="mt-7 font-serif text-4xl">{metric.value}</p><p className="mt-2 text-xs text-primary">{metric.change}</p><p className="mt-3 text-sm leading-5 text-muted-foreground">{metric.context}</p></div>)}</div></section><section className="grid gap-10 py-12 md:grid-cols-[1fr_1fr]"><div><SectionLabel>Stories from India</SectionLabel>{stories.filter((story) => story.topic === 'India').map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}</div><div><SectionLabel>Government initiatives</SectionLabel><div className="border-t border-foreground/15">{entities.filter((entity) => entity.kind === 'policy').map((entity) => <Link href={`/${entity.kind}/${entity.slug}`} key={entity.slug} className="block border-b border-foreground/15 py-5 hover:text-primary"><p className="font-serif text-2xl">{entity.name}</p><p className="mt-2 text-sm text-muted-foreground">{entity.strapline}</p></Link>)}</div></div></section><Newsletter compact /></main></Shell>;
}

export function AskPage() {
  const [selected, setSelected] = useState(askGlobalAnswers[0]);
  const [question, setQuestion] = useState('');
  const answer = (question ? askGlobalAnswers.find((item) => item.question.toLowerCase() === question.toLowerCase()) : selected) ?? selected;
  return <Shell><SeoHead title="Ask Global — Global AI News" description="An intelligence interface for asking what changed." path="/ask" /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Ask Global · intelligence interface</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">Ask what<br /><em className="text-primary">changed.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">Answers grounded in Global AI News stories, sources, timelines and entities — not a generic chatbot.</p><form onSubmit={(event) => { event.preventDefault(); const found = askGlobalAnswers.find((item) => item.question.toLowerCase().includes(question.toLowerCase())); if (found) setSelected(found); }} className="mt-9 flex max-w-2xl gap-2 border-b border-foreground/40 py-3"><Search size={18} className="mt-1 text-primary" /><input data-testid="input-ask-global" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What do you want to understand?" className="min-w-0 flex-1 bg-transparent outline-none" /><button data-testid="button-ask-global" className="font-mono text-[10px] uppercase tracking-widest text-primary">Ask</button></form></section><section className="grid gap-10 py-12 md:grid-cols-[.7fr_1.3fr]"><aside><SectionLabel>Start here</SectionLabel><div className="grid gap-2">{askGlobalAnswers.map((item) => <button data-testid={`button-ask-example-${item.slug}`} type="button" key={item.slug} onClick={() => { setSelected(item); setQuestion(item.question); }} className={`border-b border-foreground/15 py-4 text-left text-sm hover:text-primary ${selected.slug === item.slug ? 'text-primary' : ''}`}>{item.question}</button>)}</div></aside><article className="border-l border-foreground/15 pl-0 md:pl-10"><p className="eyebrow text-primary">Answer · as of {answer.asOf}</p><h2 data-testid="text-ask-question" className="mt-4 font-serif text-4xl leading-[.9]">{answer.question}</h2><p data-testid="text-ask-answer" className="mt-7 max-w-2xl text-lg leading-8">{answer.answer}</p><div className="mt-10 grid gap-8 border-t border-foreground/15 pt-6 sm:grid-cols-3"><div><p className="eyebrow text-muted-foreground">Stories</p><div className="mt-3 grid gap-2">{answer.citedStories.map((slug) => <Link href={storyHref(slug)} key={slug} className="text-sm hover:text-primary">{findStory(slug)?.title ?? slug}</Link>)}</div></div><div><p className="eyebrow text-muted-foreground">Entities</p><div className="mt-3 grid gap-2">{answer.citedEntities.map((slug) => { const entity = findEntity(slug); return entity ? <Link href={`/${entity.kind}/${slug}`} key={slug} className="text-sm hover:text-primary">{entity.name}</Link> : null; })}</div></div><div><p className="eyebrow text-muted-foreground">Sources</p><div className="mt-3 grid gap-2">{answer.citedSources.map((slug) => <a href={sources.find((source) => source.slug === slug)?.url} target="_blank" rel="noreferrer" key={slug} className="text-sm hover:text-primary">{sources.find((source) => source.slug === slug)?.publisher ?? slug} <ArrowUpRight size={12} className="inline" /></a>)}</div></div></div><div className="mt-8"><SectionLabel>Timeline</SectionLabel><TimelineList slugs={answer.citedTimeline} /></div></article></section></main></Shell>;
}

export function ArticlePage() {
  const { slug = 'ai-models-antibiotic-discovery' } = useParams<{ slug: string }>();
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const story = findStory(slug) ?? findStory('ai-models-antibiotic-discovery')!;
  const author = authors.find((item) => item.slug === story.author) ?? authors[0];
  return <Shell><SeoHead article title={`${story.title} — Global AI News`} description={story.dek} path={`/article/${story.slug}`} /><main className={`${container} max-w-[1180px]`}><nav aria-label="Breadcrumb" className="pt-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><Link href="/">Home</Link><span className="mx-2">/</span><Link href="/research">Research</Link><span className="mx-2">/</span><span>{story.category}</span></nav><header className="max-w-5xl py-10 md:py-16"><p className="eyebrow text-primary">{story.category} · {story.classification}</p><h1 className="mt-5 font-serif text-6xl leading-[.84] tracking-[-.03em] md:text-[7.8rem]">{story.title}</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-muted-foreground">{story.dek}</p><div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-foreground/15 py-4 text-xs"><span><b>{author.name}</b> · {author.role} · {story.date} · {story.readTime}</span><div className="flex gap-2"><button data-testid="button-article-bookmark" type="button" onClick={() => setSaved(!saved)} className="border border-foreground/20 px-3 py-2 hover:border-primary">{saved ? 'Saved' : 'Save'}</button><button data-testid="button-article-share" type="button" onClick={async () => { setShared(true); if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href); }} className="flex items-center gap-2 border border-foreground/20 px-3 py-2 hover:border-primary"><Share2 size={14} />{shared ? 'Copied' : 'Share'}</button></div></div></header><EditorialImage large treatment={story.imageTreatment.type} alt={story.imageTreatment.alt} caption={story.imageTreatment.caption} /><div className="grid gap-12 py-12 md:grid-cols-[minmax(0,740px)_280px]"><article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:leading-8 prose-p:text-foreground/85"><section className="not-prose border-l-2 border-primary bg-secondary/50 p-6"><p className="eyebrow text-primary">The bottom line</p><p className="mt-3 font-serif text-3xl leading-none">{story.bottomLine}</p></section><section className="not-prose mt-10"><p className="eyebrow text-primary">Why this matters</p><p className="mt-3 text-lg leading-8">{story.whyItMatters}</p></section><section className="not-prose mt-10 border-y border-foreground/15 py-6"><p className="eyebrow text-primary">Key takeaways</p><ul className="mt-4 grid gap-3 text-sm">{story.keyTakeaways.map((item) => <li key={item} className="flex gap-3"><span className="text-primary">—</span>{item}</li>)}</ul></section>{story.body.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.pullQuote && <blockquote>{section.pullQuote}</blockquote>}</section>)}<section className="not-prose mt-10 border-t border-foreground/15 pt-6"><p className="eyebrow text-primary">What changes</p><p className="mt-3 text-lg leading-8">{story.whatChanges}</p></section><section className="not-prose mt-10"><SectionLabel>Metrics in context</SectionLabel><div className="grid gap-px border bg-foreground/15 sm:grid-cols-3"><div className="bg-background p-5"><p className="eyebrow">Candidates</p><p className="mt-4 font-serif text-3xl">Millions</p><p className="mt-2 text-xs text-muted-foreground">Searchable chemical space</p></div><div className="bg-background p-5"><p className="eyebrow">Loop</p><p className="mt-4 font-serif text-3xl">Model → lab</p><p className="mt-2 text-xs text-muted-foreground">The durable interface</p></div><div className="bg-background p-5"><p className="eyebrow">Confidence</p><p className="mt-4 font-serif text-3xl">High</p><p className="mt-2 text-xs text-muted-foreground">Editorial assessment</p></div></div></section><section className="not-prose mt-10"><SectionLabel>Sources</SectionLabel><div className="grid gap-3">{story.sources.map((slug) => { const source = sources.find((item) => item.slug === slug); return source ? <a href={source.url} target="_blank" rel="noreferrer" key={slug} className="border-b border-foreground/15 pb-3 text-sm hover:text-primary">{source.name}<span className="mt-1 block text-xs text-muted-foreground">{source.publisher} · {source.kind}</span></a> : null; })}</div></section></article><aside className="space-y-10"><EvidencePanel storySlug={story.slug} /><section><SectionLabel>Related entities</SectionLabel><EntityLinks slugs={story.entities} /></section><section><SectionLabel>Timeline</SectionLabel><TimelineList slugs={story.timeline} /></section></aside></div><section className="border-t border-foreground/15 py-12"><SectionLabel>Next stories</SectionLabel><div className="grid gap-6 md:grid-cols-3">{story.relatedStories.map((slug) => <StoryRow key={slug} slug={slug} />)}</div></section><Newsletter compact /></main></Shell>;
}

export function EntityPage({ kind }: { kind: string }) {
  const { slug = '' } = useParams<{ slug: string }>();
  const entity = findEntity(slug);
  const person = kind === 'person' ? authors.find((item) => item.slug === slug) : undefined;
  if (person) {
    const authored = stories.filter((story) => story.author === person.slug);
    return <Shell><SeoHead title={`${person.name} — Global AI News`} description={person.bio} path={`/person/${slug}`} /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-16 md:py-24"><p className="eyebrow text-primary">People intelligence · contributor profile</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{person.name}</h1><p className="mt-6 text-xl text-muted-foreground">{person.role} · {person.location}</p><p className="mt-7 max-w-2xl text-lg leading-8">{person.bio}</p></section><section className="grid gap-10 py-12 md:grid-cols-[.65fr_1.35fr]"><div><SectionLabel>Recent work</SectionLabel>{authored.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}</div><aside><SectionLabel>About the desk</SectionLabel><p className="text-sm leading-7">Global AI News contributors connect reported stories to the entities, sources and timelines that make the industry understandable.</p></aside></section></main></Shell>;
  }
  if (!entity) return <Shell><main className={`${container} py-24`}><h1 className="font-serif text-6xl">Entity not found.</h1><Link href="/industry" className="mt-6 inline-block text-primary">Return to the industry map</Link></main></Shell>;
  return <Shell><SeoHead title={`${entity.name} — Global AI News`} description={entity.overview} path={`/${kind}/${slug}`} /><main className={container}><section className="grid gap-10 border-b border-foreground/20 py-14 md:grid-cols-[1fr_.65fr] md:py-20"><div><p className="eyebrow text-primary">{entity.kind} intelligence · profile</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{entity.name}</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">{entity.strapline}</p><p className="mt-7 max-w-2xl text-sm leading-7">{entity.overview}</p></div><div className="border-l border-foreground/15 pl-6 md:pl-10"><p className="eyebrow text-muted-foreground">At a glance</p>{entity.headquarters && <p className="mt-5 border-b border-foreground/15 pb-3 text-sm"><span className="text-muted-foreground">Based in</span><br />{entity.headquarters}</p>}{entity.founded && <p className="border-b border-foreground/15 py-3 text-sm"><span className="text-muted-foreground">Founded</span><br />{entity.founded}</p>}</div></section><section className="grid gap-10 py-12 md:grid-cols-[.65fr_1.35fr]"><div><SectionLabel>Key metrics</SectionLabel><div className="grid gap-4">{entity.keyMetrics.map((metric) => <div key={metric.label} className="border-b border-foreground/15 pb-4"><p className="eyebrow text-primary">{metric.label}</p><p className="mt-2 font-serif text-3xl">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.context}</p></div>)}</div></div><div><SectionLabel>Latest developments</SectionLabel><ul className="grid gap-4 text-lg">{entity.latestDevelopments.map((item) => <li key={item} className="border-b border-foreground/15 pb-4">{item}</li>)}</ul><div className="mt-12"><SectionLabel>Signals</SectionLabel><div className="flex flex-wrap gap-3">{entity.signals.map((slug) => <Link href="/signals" key={slug} className="border border-foreground/20 px-3 py-2 text-sm hover:border-primary">{signals.find((signal) => signal.slug === slug)?.label ?? slug}</Link>)}</div></div></div></section><section className="grid gap-10 border-t border-foreground/15 py-12 md:grid-cols-2"><div><SectionLabel>Related organizations</SectionLabel><EntityLinks slugs={entity.relatedOrganizations} /></div><div><SectionLabel>Recent stories</SectionLabel>{entity.recentStories.map((slug, index) => <StoryRow key={slug} slug={slug} rank={index + 1} compact />)}</div></section><section className="border-t border-foreground/15 py-12"><SectionLabel>Timeline</SectionLabel><TimelineList slugs={entity.timeline} /></section></main></Shell>;
}

export function TimelinePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const event = findTimeline(slug);
  if (!event) return <Shell><main className={`${container} py-24`}><h1 className="font-serif text-6xl">Timeline event not found.</h1></main></Shell>;
  return <Shell><SeoHead title={`${event.title} — Global AI News`} description={event.description} path={`/timeline/${slug}`} /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-16 md:py-24"><p className="eyebrow text-primary">Timeline event · {event.date}</p><h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[8rem]">{event.title}</h1><p className="mt-8 max-w-2xl text-xl leading-8 text-muted-foreground">{event.description}</p></section><section className="grid gap-12 py-12 md:grid-cols-[1fr_300px]"><div><SectionLabel>Connected record</SectionLabel><p className="text-lg leading-8">This event sits inside a living chronology of the people, companies, models and policy decisions shaping the industry.</p>{event.story && <div className="mt-10"><SectionLabel>Read the story</SectionLabel><StoryRow slug={event.story} /></div>}</div><aside><SectionLabel>Entities</SectionLabel><EntityLinks slugs={event.entities} /></aside></section></main></Shell>;
}

function SocialPreviewCard({ story }: { story: Story }) {
  const title = `${story.title} — Global AI News`;
  const route = `/article/${story.slug}`;
  const layout = layoutPreviewTitle(title, route);
  const accent = socialPreviewAccent(story.slug);
  const titleId = `social-preview-title-${story.slug}`;
  const descriptionId = `social-preview-description-${story.slug}`;
  const isScaled = layout.fontSize < 54;

  return <div data-testid="social-preview-card" className="border border-foreground/15 bg-[#f4f1ea]">
    <div className="aspect-[1200/630] w-full">
      <svg className="block h-full w-full" viewBox={`0 0 ${socialPreviewWidth} ${socialPreviewHeight}`} role="img" aria-label={`Global AI News social preview for ${title}`} aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>{title}</title>
        <desc id={descriptionId}>Global AI News editorial preview for {title}</desc>
        <rect width={socialPreviewWidth} height={socialPreviewHeight} fill="#f4f1ea" />
        <circle cx="1000" cy="150" r="184" fill="none" stroke={accent} strokeWidth="2" />
        <circle cx="1000" cy="150" r="122" fill="none" stroke={accent} strokeOpacity=".42" strokeWidth="2" />
        <path d="M80 520H1120" stroke={accent} strokeWidth="3" />
        <path d="M80 532H420" stroke="#101820" strokeOpacity=".24" />
        <EditorialSealGlyph x={80} y={48} size={44} />
        <text x={142} y="80" fill={BRAND_COLORS.ink} fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="700" letterSpacing="2.5">GLOBAL <tspan fill={BRAND_COLORS.blue}>AI</tspan> NEWS</text>
        <text x={socialPreviewTitleX} y="142" fill="#56616b" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" letterSpacing="1.5">{story.category.toUpperCase()} / FIELD NOTE</text>
        {layout.lines.map((line, index) => <text key={line} x={socialPreviewTitleX} y={socialPreviewTitleStartY + index * layout.lineHeight} fill="#101820" fontFamily="Georgia, 'Times New Roman', serif" fontSize={layout.fontSize} fontWeight="700">{line}</text>)}
        <text x={socialPreviewTitleX} y={socialPreviewFooterY} fill="#56616b" fontFamily="Arial, Helvetica, sans-serif" fontSize="18">globalainews.in</text>
      </svg>
    </div>
    <div className="grid gap-5 border-t border-foreground/15 bg-background px-5 py-4 text-xs sm:grid-cols-[auto_1fr]">
      <div>
        <p className="eyebrow text-muted-foreground">Card format</p>
        <p data-testid="social-preview-dimensions" className="mt-2 font-mono text-primary">1200 × 630 PNG</p>
      </div>
      <div>
        <p className="eyebrow text-muted-foreground">Headline treatment</p>
        <p data-testid="social-preview-scale-status" className="mt-2 font-mono text-primary">{isScaled ? `Scaled to ${layout.fontSize}px` : 'Default 54px'} · {layout.lines.length} lines</p>
        <div data-testid="social-preview-line-breaks" className="mt-3 flex flex-wrap gap-2" aria-label="Headline line breaks">
          {layout.lines.map((line, index) => <span data-testid={`social-preview-line-${index + 1}`} key={`${index}-${line}`} className="border border-foreground/15 bg-[#f4f1ea] px-2 py-1 font-mono text-[10px]">{line}</span>)}
        </div>
      </div>
    </div>
  </div>;
}

type ReleaseFormValue = {
  slug: string;
  title: string;
  dek: string;
  publishAt: string;
  cadence: 'daily' | 'weekly';
  category: string;
  author: string;
  body: string;
};

function releaseBody(release: EditorialRelease): string {
  const story = release.story as Record<string, unknown>;
  if (typeof story.body === 'string') return story.body;
  if (!Array.isArray(story.body)) return '';
  return story.body
    .flatMap((section) => {
      if (!section || typeof section !== 'object') return [];
      const paragraphs = (section as { paragraphs?: unknown }).paragraphs;
      return Array.isArray(paragraphs) ? paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string') : [];
    })
    .join('\n\n');
}

function releaseToForm(release: EditorialRelease): ReleaseFormValue {
  return {
    slug: release.slug,
    title: release.title,
    dek: release.dek,
    publishAt: toDateTimeInput(release.publishAt),
    cadence: release.cadence,
    category: typeof release.story.category === 'string' ? release.story.category : 'Field Notes',
    author: typeof release.story.author === 'string' ? release.story.author : authors[0]?.slug ?? '',
    body: releaseBody(release),
  };
}

function toDateTimeInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function toPublishAt(value: string): string {
  return value ? `${value}:00Z` : '';
}

function defaultReleaseForm(story?: Story): ReleaseFormValue {
  const next = new Date(Date.now() + 24 * 60 * 60 * 1000);
  next.setUTCHours(7, 30, 0, 0);
  return {
    slug: '',
    title: '',
    dek: '',
    publishAt: toDateTimeInput(next.toISOString()),
    cadence: 'daily',
    category: story?.category ?? 'Field Notes',
    author: story?.author ?? authors[0]?.slug ?? '',
    body: story?.body.flatMap((section) => section.paragraphs).join('\n\n') ?? '',
  };
}

function releaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'status' in error && Number((error as { status?: unknown }).status) === 401) {
    return 'Editor sign-in is required to change releases.';
  }
  if (error && typeof error === 'object' && 'error' in error) return String((error as { error: unknown }).error);
  if (error instanceof Error) return error.message;
  return 'The release could not be saved. Check the fields and try again.';
}

function EditorSessionBar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const label = user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? 'Signed-in editor';
  return <div data-testid="editor-session" className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-primary/25 bg-primary/5 px-4 py-3 text-sm"><span>Signed in as <strong>{label}</strong></span><button type="button" onClick={() => void signOut({ redirectUrl: `${basePath || ''}/insights` })} className="border-b border-primary pb-1 font-mono text-[10px] uppercase tracking-widest text-primary">Sign out</button></div>;
}

function ReleaseEditor({
  initialValue,
  editing,
  categories,
  onCancel,
  onSubmit,
  saving,
}: {
  initialValue: ReleaseFormValue;
  editing: boolean;
  categories: string[];
  onCancel: () => void;
  onSubmit: (value: ReleaseFormValue) => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const update = (field: keyof ReleaseFormValue, next: string) => setValue((current) => ({ ...current, [field]: next }));
  return <form data-testid={editing ? 'form-edit-release' : 'form-create-release'} onSubmit={(event) => { event.preventDefault(); onSubmit(value); }} className="border border-primary/30 bg-[#f1eee6] p-5 md:p-7">
    <div className="flex items-start justify-between gap-5 border-b border-foreground/15 pb-5">
      <div><p className="eyebrow text-primary">{editing ? 'Edit prepared article' : 'New prepared article'}</p><h3 className="mt-2 font-serif text-3xl leading-none">{editing ? 'Keep the handoff precise.' : 'Prepare the next edition.'}</h3></div>
      <button data-testid="button-close-release-editor" type="button" onClick={onCancel} aria-label="Close release editor" className="border border-foreground/20 p-2 hover:border-primary hover:text-primary"><X size={16} /></button>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <label className="md:col-span-2"><span className="eyebrow text-muted-foreground">Headline</span><input data-testid="input-release-title" required maxLength={240} value={value.title} onChange={(event) => update('title', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 font-serif text-2xl outline-none focus:border-primary" /></label>
      {!editing && <label><span className="eyebrow text-muted-foreground">Slug</span><input data-testid="input-release-slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" minLength={2} maxLength={120} value={value.slug} onChange={(event) => update('slug', event.target.value.toLowerCase())} placeholder="a-clear-editorial-slug" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary" /></label>}
      <label className={editing ? 'md:col-span-2' : ''}><span className="eyebrow text-muted-foreground">Standfirst</span><input data-testid="input-release-dek" required maxLength={500} value={value.dek} onChange={(event) => update('dek', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary" /></label>
      <label><span className="eyebrow text-muted-foreground">Release time · UTC</span><input data-testid="input-release-publish-at" required type="datetime-local" value={value.publishAt} onChange={(event) => update('publishAt', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary" /></label>
      <label><span className="eyebrow text-muted-foreground">Cadence</span><select data-testid="select-release-cadence" value={value.cadence} onChange={(event) => update('cadence', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary"><option value="daily">Daily edition</option><option value="weekly">Weekly edition</option></select></label>
      <label><span className="eyebrow text-muted-foreground">Desk</span><select data-testid="select-release-category" required value={value.category} onChange={(event) => update('category', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary">{categories.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
      <label><span className="eyebrow text-muted-foreground">Author</span><select data-testid="select-release-author" required value={value.author} onChange={(event) => update('author', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary">{authors.map((author) => <option value={author.slug} key={author.slug}>{author.name}</option>)}</select></label>
      <label className="md:col-span-2"><span className="eyebrow text-muted-foreground">Working copy</span><textarea data-testid="textarea-release-body" required minLength={1} value={value.body} onChange={(event) => update('body', event.target.value)} rows={7} className="mt-2 w-full resize-y border border-foreground/20 bg-background p-3 text-sm leading-6 outline-none focus:border-primary" /></label>
    </div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/15 pt-5"><p className="max-w-md text-xs leading-5 text-muted-foreground">The article will enter the durable release queue and remain editable until it publishes.</p><div className="flex gap-2"><button data-testid="button-cancel-release-editor" type="button" onClick={onCancel} className="border border-foreground/20 px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-primary">Discard</button><button data-testid="button-save-release" type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background disabled:cursor-wait disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : 'Add to queue'}</button></div></div>
  </form>;
}

export function InsightsPage() {
  const { stories: newsroomStories } = useNewsroomSnapshot();
  const [previewSlug, setPreviewSlug] = useState(newsroomStories[0]?.slug ?? '');
  const previewStory = newsroomStories.find((story) => story.slug === previewSlug) ?? newsroomStories[0];
  const releasesQuery = useGetNewsroomReleases({ query: { queryKey: getGetNewsroomReleasesQueryKey(), staleTime: 0, refetchOnMount: true, retry: 1 } });
  const [historyReleaseSlug, setHistoryReleaseSlug] = useState('');
  const [historyAction, setHistoryAction] = useState<EditorialReleaseHistoryActionType | ''>('');
  const historyFilters = {
    releaseSlug: historyReleaseSlug || undefined,
    action: historyAction || undefined,
  };
  const historyQuery = useGetNewsroomReleaseHistory(historyFilters, { query: { queryKey: getGetNewsroomReleaseHistoryQueryKey(historyFilters), staleTime: 0, refetchOnMount: true, retry: 1 } });
  const createRelease = useCreateNewsroomRelease();
  const updateRelease = useUpdateNewsroomRelease();
  const cancelRelease = useCancelNewsroomRelease();
  const reorderReleases = useReorderNewsroomReleases();
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<{ release?: EditorialRelease; value: ReleaseFormValue } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const queue = releasesQuery.data ?? [];
  const orderedQueue = [...queue].sort((a, b) => a.position - b.position);
  const scheduled = orderedQueue.filter((release) => release.status === 'scheduled');
  const categories = Array.from(new Set(newsroomStories.map((story) => story.category)));
  const historyReleaseOptions = Array.from(new Set(orderedQueue.map((release) => release.slug)));
  const historyFilterActive = Boolean(historyReleaseSlug || historyAction);
  const syncQueue = (next: EditorialRelease[]) => {
    const sorted = [...next].sort((a, b) => a.position - b.position);
    queryClient.setQueryData(getGetNewsroomReleasesQueryKey(), sorted);
    void releasesQuery.refetch();
    void historyQuery.refetch();
  };
  const openCreate = () => {
    setActionError(null);
    setEditor({ value: defaultReleaseForm(newsroomStories[0]) });
  };
  const openEdit = (release: EditorialRelease) => {
    setActionError(null);
    setEditor({ release, value: releaseToForm(release) });
  };
  const saveRelease = async (value: ReleaseFormValue) => {
    setActionError(null);
    setBusy(editor?.release ? `save-${editor.release.slug}` : 'create');
    try {
      if (editor?.release) {
        const data: EditorialReleaseUpdate = { title: value.title, dek: value.dek, publishAt: toPublishAt(value.publishAt), cadence: value.cadence, category: value.category, author: value.author, body: value.body };
        const updated = await updateRelease.mutateAsync({ slug: editor.release.slug, data });
        syncQueue(queue.map((release) => release.slug === updated.slug ? updated : release));
      } else {
        const data: EditorialReleaseInput = { slug: value.slug, title: value.title, dek: value.dek, publishAt: toPublishAt(value.publishAt), cadence: value.cadence, category: value.category, author: value.author, body: value.body };
        const created = await createRelease.mutateAsync({ data });
        syncQueue([...queue, created]);
      }
      setEditor(null);
    } catch (error) {
      setActionError(releaseError(error));
    } finally {
      setBusy(null);
    }
  };
  const cancelPrepared = async (release: EditorialRelease) => {
    if (!window.confirm(`Cancel “${release.title}”? This removes it from the prepared queue.`)) return;
    setActionError(null);
    setBusy(`cancel-${release.slug}`);
    try {
      const canceled = await cancelRelease.mutateAsync({ slug: release.slug });
      syncQueue(queue.map((item) => item.slug === canceled.slug ? canceled : item));
    } catch (error) {
      setActionError(releaseError(error));
    } finally {
      setBusy(null);
    }
  };
  const moveRelease = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= scheduled.length) return;
    const slugs = scheduled.map((release) => release.slug);
    [slugs[index], slugs[target]] = [slugs[target], slugs[index]];
    setActionError(null);
    setBusy('reorder');
    try {
      const reordered = await reorderReleases.mutateAsync({ data: { slugs } });
      syncQueue(reordered);
    } catch (error) {
      setActionError(releaseError(error));
    } finally {
      setBusy(null);
    }
  };
  return <Shell><SeoHead title="Publisher workspace — Global AI News" description="Internal editorial intelligence workspace." path="/insights" /><main className={container}>
    <section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Internal editorial surface</p><h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">The room<br /><em className="text-primary">is reading.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">A calm view of audience attention, the publishing calendar and the questions worth following next.</p></section>
    <section className="grid gap-px border-x border-b border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">{[['42,806', 'Daily brief subscribers', '+8.4%'], ['18,492', 'Readers right now', '+12.1%'], ['63%', 'Returning readers', '+4.6%'], ['7m 42s', 'Average depth', '+0:38']].map(([value, label, delta]) => <div data-testid={`metric-${label.toLowerCase().replace(/\s/g, '-')}`} key={label} className="bg-background p-6"><p className="eyebrow text-muted-foreground">{label}</p><p className="mt-7 font-serif text-4xl">{value}</p><p className="mt-2 text-xs text-primary">{delta} today</p></div>)}</section>
     <Show when="signed-out"><section data-testid="editor-signed-out-state" className="border-b border-foreground/20 py-10"><div className="border border-primary/25 bg-primary/5 p-6 md:flex md:items-center md:justify-between md:gap-8"><div><p className="eyebrow text-primary">Editor access</p><h2 className="mt-3 font-serif text-3xl leading-none">Sign in before changing the release desk.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Public stories stay open to every reader. Release creation, sequencing, edits and cancellations require an authenticated editor session.</p></div><Link href="/sign-in" className="mt-6 inline-flex shrink-0 items-center gap-2 bg-foreground px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-background md:mt-0">Sign in as editor <ArrowUpRight size={14} /></Link></div></section></Show>
     <Show when="signed-in"><EditorSessionBar /><section data-testid="editorial-queue" className="border-b border-foreground/20 py-14">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><SectionLabel>Durable release desk</SectionLabel><h2 className="mt-3 max-w-xl font-serif text-5xl leading-[.9]">Prepare the next edition.</h2><p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">Create, sequence and reschedule prepared articles without changing the publication build.</p></div><div className="flex gap-2"><button data-testid="button-refresh-releases" type="button" onClick={() => { void releasesQuery.refetch(); void historyQuery.refetch(); }} className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary"><RefreshCw size={13} />Refresh</button><button data-testid="button-new-release" type="button" onClick={openCreate} className="inline-flex items-center gap-2 bg-foreground px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-background"><Plus size={14} />New release</button></div></div>
      {editor && <div className="mt-8"><ReleaseEditor key={editor.release?.slug ?? 'new-release'} initialValue={editor.value} editing={Boolean(editor.release)} categories={Array.from(new Set([...categories, editor.value.category]))} onCancel={() => setEditor(null)} onSubmit={saveRelease} saving={busy === 'create' || Boolean(editor.release && busy === `save-${editor.release.slug}`)} /></div>}
      {actionError && <div role="alert" className="mt-5 flex items-center justify-between gap-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm"><span>{actionError}</span><button type="button" onClick={() => setActionError(null)} aria-label="Dismiss release error"><X size={15} /></button></div>}
      {releasesQuery.isLoading && <div className="mt-8 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-48 animate-pulse bg-background/70 p-6"><div className="h-3 w-20 bg-foreground/10" /><div className="mt-8 h-8 w-4/5 bg-foreground/10" /><div className="mt-8 h-3 w-2/5 bg-foreground/10" /></div>)}</div>}
      {releasesQuery.isError && <div className="mt-8 border border-destructive/35 p-6"><p className="eyebrow text-destructive">Release queue unavailable</p><p className="mt-3 text-sm text-muted-foreground">The editor-managed queue could not be read.</p><button type="button" onClick={() => void releasesQuery.refetch()} className="mt-5 border border-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button></div>}
      {!releasesQuery.isLoading && !releasesQuery.isError && orderedQueue.length === 0 && <div className="mt-8 border border-dashed border-foreground/25 p-8"><p className="eyebrow text-primary">No prepared releases</p><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">The queue is clear. Add a prepared article to give the next edition a durable place in the publishing calendar.</p><button type="button" onClick={openCreate} className="mt-6 inline-flex items-center gap-2 border-b border-primary pb-2 text-sm text-primary"><Plus size={14} />Prepare an article</button></div>}
      {orderedQueue.length > 0 && <div className="mt-8 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-2 xl:grid-cols-3">{orderedQueue.map((release) => { const activeIndex = scheduled.findIndex((item) => item.slug === release.slug); const isScheduled = release.status === 'scheduled'; return <article data-testid={`editorial-queue-${release.slug}`} key={release.slug} className="bg-background p-6"><div className="flex items-center justify-between gap-4"><p className={`eyebrow ${release.status === 'published' ? 'text-primary' : release.status === 'canceled' ? 'text-destructive' : 'text-muted-foreground'}`}>{release.status}</p><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{release.cadence}</span></div><h3 className="mt-7 font-serif text-2xl leading-[.95]">{release.title}</h3><p className="mt-4 text-sm leading-5 text-muted-foreground">{release.dek}</p><p className="mt-5 border-t border-foreground/15 pt-4 text-xs text-muted-foreground">Release {formatScheduleTime(release.publishAt)}</p>{isScheduled && <div className="mt-5 flex flex-wrap items-center gap-2"><button data-testid={`button-move-release-up-${release.slug}`} type="button" disabled={activeIndex <= 0 || busy === 'reorder'} onClick={() => void moveRelease(activeIndex, -1)} className="inline-flex items-center gap-1 border border-foreground/20 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-primary disabled:opacity-30"><ArrowUp size={12} />Earlier</button><button data-testid={`button-move-release-down-${release.slug}`} type="button" disabled={activeIndex < 0 || activeIndex === scheduled.length - 1 || busy === 'reorder'} onClick={() => void moveRelease(activeIndex, 1)} className="inline-flex items-center gap-1 border border-foreground/20 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-primary disabled:opacity-30"><ArrowDown size={12} />Later</button><button data-testid={`button-edit-release-${release.slug}`} type="button" onClick={() => openEdit(release)} className="inline-flex items-center gap-1 border border-foreground/20 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary"><Pencil size={12} />Edit</button><button data-testid={`button-cancel-release-${release.slug}`} type="button" disabled={busy === `cancel-${release.slug}`} onClick={() => void cancelPrepared(release)} className="border-b border-destructive/50 px-1 py-1.5 font-mono text-[10px] uppercase tracking-widest text-destructive hover:border-destructive disabled:opacity-40">Cancel</button></div>}</article>; })}</div>}
      <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">Prepared stories move into the live newsroom automatically at their scheduled time. Published and canceled records stay visible as an editorial trail.</p>
       <div data-testid="release-history" className="mt-14 border-t border-foreground/15 pt-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><SectionLabel>Release history</SectionLabel><h3 className="mt-3 font-serif text-4xl leading-none">Recent changes.</h3><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">A durable record of who changed the queue, what changed and when.</p></div><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Last 50 events</span></div><div className="mt-7 grid gap-3 border-y border-foreground/15 py-5 md:grid-cols-[1fr_1fr_auto] md:items-end"><label className="block"><span className="eyebrow text-muted-foreground">Release</span><select data-testid="select-release-history-release" value={historyReleaseSlug} onChange={(event) => setHistoryReleaseSlug(event.target.value)} className="mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm"><option value="">All releases</option>{historyReleaseOptions.map((slug) => <option value={slug} key={slug}>{queue.find((release) => release.slug === slug)?.title ?? slug}</option>)}<option value="queue">Queue-level changes</option></select></label><label className="block"><span className="eyebrow text-muted-foreground">Change type</span><select data-testid="select-release-history-action" value={historyAction} onChange={(event) => setHistoryAction(event.target.value as EditorialReleaseHistoryActionType | '')} className="mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm"><option value="">All change types</option>{Object.values(EditorialReleaseHistoryAction).map((action) => <option value={action} key={action}>{action}</option>)}</select></label>{historyFilterActive && <button data-testid="button-clear-release-history-filters" type="button" onClick={() => { setHistoryReleaseSlug(''); setHistoryAction(''); }} className="border-b border-primary px-1 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Clear filters</button>}</div>{historyQuery.isLoading && <p className="mt-7 border border-foreground/15 p-5 text-sm text-muted-foreground">Loading release history…</p>}{historyQuery.isError && <div className="mt-7 border border-destructive/35 p-5"><p className="eyebrow text-destructive">History unavailable</p><button type="button" onClick={() => void historyQuery.refetch()} className="mt-4 border border-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button></div>}{!historyQuery.isLoading && !historyQuery.isError && (historyQuery.data?.length ?? 0) === 0 && <p className="mt-7 border border-dashed border-foreground/25 p-5 text-sm text-muted-foreground">{historyFilterActive ? 'No matching release change was found. Try a different release or change type.' : 'No release changes have been recorded yet.'}</p>}{(historyQuery.data?.length ?? 0) > 0 && <div className="mt-7 divide-y divide-foreground/15 border-y border-foreground/15">{historyQuery.data?.map((entry) => <article data-testid={`release-history-${entry.id}`} key={entry.id} className="grid gap-3 py-5 md:grid-cols-[150px_1fr_auto] md:items-start"><div><p className="eyebrow text-primary">{entry.action}</p><p className="mt-2 font-mono text-[10px] text-muted-foreground">{formatHistoryTime(entry.createdAt)}</p></div><div><p className="text-sm leading-6">{entry.summary}</p><p className="mt-2 text-xs text-muted-foreground">{entry.releaseTitle}</p></div><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:text-right">By {entry.actor}</p></article>)}</div>}</div>
     </section></Show>
    <section className="border-b border-foreground/20 py-14"><div className="grid gap-10 md:grid-cols-[.65fr_1.35fr] md:items-start"><div><SectionLabel>Share card preview</SectionLabel><h2 className="mt-3 max-w-md font-serif text-5xl leading-[.9]">See the headline before it travels.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">This 1200 × 630 treatment is the same layout used for published social cards. Select a story to inspect the fallback size and exact line breaks.</p>{previewStory && <label className="mt-7 block max-w-sm"><span className="eyebrow text-muted-foreground">Article</span><select data-testid="select-social-preview-story" value={previewStory.slug} onChange={(event) => setPreviewSlug(event.target.value)} className="mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm">{newsroomStories.map((story) => <option value={story.slug} key={story.slug}>{story.title}</option>)}</select></label>}</div><div>{previewStory ? <SocialPreviewCard story={previewStory} /> : <p className="border border-foreground/15 p-6 text-sm text-muted-foreground">No published stories are available for preview.</p>}</div></div></section>
    <section className="grid gap-12 py-14 md:grid-cols-[1.1fr_.9fr]"><div><SectionLabel>Publishing calendar</SectionLabel>{['The model race after the benchmark era', 'India builds in public', 'The cost of intelligence', 'Proof, not demos'].map((title, index) => <div key={title} className="flex items-start justify-between border-t border-foreground/15 py-5"><div><p className="eyebrow text-primary">0{index + 1} · planned</p><p className="mt-2 font-serif text-2xl">{title}</p></div><span className="font-mono text-xs text-muted-foreground">{['OCT', 'NOV', 'DEC', 'JAN'][index]}</span></div>)}</div><div><SectionLabel>Live stories</SectionLabel>{newsroomStories.slice(0, 4).map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} compact />)}</div></section>
    </main></Shell>;
}

export function TopicPage({ kind }: { kind: 'ai' | 'india' }) {
  const list = stories.filter((story) => kind === 'ai' ? story.topic !== 'India' : story.topic === 'India');
  return <Shell><SeoHead title={`${kind === 'ai' ? 'Artificial intelligence' : 'India Watch'} — Global AI News`} description="A focused Global AI News desk." path={`/topic/${kind}`} /><main className={container}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">{kind === 'ai' ? 'Topic desk' : 'Regional desk'}</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{kind === 'ai' ? <>Artificial<br /><em className="text-primary">intelligence.</em></> : <>India<br /><em className="text-primary">Watch.</em></>}</h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">{kind === 'ai' ? 'Models, labs, products and the people building the next layer of the internet.' : 'The companies, public infrastructure and people making India’s technology story impossible to ignore.'}</p></section><section className="grid gap-10 py-12 md:grid-cols-[1fr_280px]"><div>{list.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}</div><aside><SectionLabel>Evergreen entry points</SectionLabel>{['The model race', 'AI in science', 'The infrastructure map', 'Public AI systems'].map((item) => <Link href="/research" key={item} className="block border-b border-foreground/15 py-4 text-sm hover:text-primary">{item}<ArrowUpRight size={14} className="float-right" /></Link>)}</aside></section><Newsletter compact /></main></Shell>;
}

export function AmpArticlePage() {
  const story = findStory('ai-models-antibiotic-discovery')!;
  return <><SeoHead article title={`${story.title} — Global AI News`} description={story.dek} path={`/article/${story.slug}`} /><main className="mx-auto max-w-2xl px-5 py-10"><p className="eyebrow text-primary">Global AI News · AMP preview</p><h1 className="mt-5 font-serif text-5xl leading-none">{story.title}</h1><p className="mt-5 text-lg text-muted-foreground">{story.dek}</p><EditorialImage alt={story.imageTreatment.alt} caption={story.imageTreatment.caption} /><p className="mt-8 text-lg leading-8">{story.bottomLine}</p>{story.body.map((section) => <section key={section.heading}><h2 className="mt-10 font-serif text-3xl">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p className="mt-4 leading-8" key={paragraph}>{paragraph}</p>)}</section>)}<Link href={`/article/${story.slug}`} className="mt-10 inline-block text-primary">Read the complete story →</Link></main></>;
}