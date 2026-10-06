import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRight, Search, Share2 } from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import { Link } from '@/components/canonical-link';
import { authors, canonicalStorySlug, entities, findEntity, findStory, findTimeline, getPublicDateModified, getReaderFacingContentType, getStoryAuthorIdentity, getStoryReadTime, industryMap, signals, sources, timelineEvents, type Story } from '@/content';
import { EditorialImage, EntityLinks, EvidencePanel, Footer, Header, Newsletter, SectionLabel, SeoHead, StoryRow, TimelineList } from '@/components/site';
import { StoryBody, StoryCitedText, StorySourceList } from '@/components/story-content';
import { useNewsroomSnapshot } from '@/newsroom';
import { formatEditorialDate, getLatestStory } from '@/editorial-date';
import { getEditorialPageCopy } from '@/editorial-pages';
import NotFound from '@/pages/not-found';

const container = 'editorial-page mx-auto max-w-[1440px] px-5 md:px-10';
function Shell({ children }: { children: ReactNode }) { return <><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground">Skip to main content</a><Header /><div id="main-content" tabIndex={-1} className="scroll-mt-20">{children}</div><Footer /></>; }
function storyHref(slug: string) { return `/article/${findStory(slug)?.slug ?? slug}`; }
export function HomePage() {
  const snapshot = useNewsroomSnapshot();
  const orderedStories = [...snapshot.stories].sort((a, b) => b.date.localeCompare(a.date));
  const [leadStory, ...topStories] = orderedStories;
  const latestStory = getLatestStory(snapshot.stories);
  const researchRecord = snapshot.researchRecords.find((record) => record.status === 'published' && record.storySlug === leadStory?.slug);
  const dataProduct = snapshot.dataProducts.find((product) => product.status === 'published' && product.storySlugs.includes(leadStory?.slug ?? ''));
  const evidenceRows = (dataProduct?.observations ?? []).slice().sort((a, b) => b.reportedOn.localeCompare(a.reportedOn)).slice(0, 4);
  const analysisStories = orderedStories.filter((story) => story.contentType === 'Analysis' || story.classification === 'analysis');
  const reportStories = orderedStories.filter((story) => story.contentType === 'Report');
  const publishedResearch = snapshot.researchRecords.filter((record) => record.status === 'published');
  const publishedData = snapshot.dataProducts.filter((product) => product.status === 'published');
  const pulseTopics = snapshot.topics.filter((topic) => topic.indexable).slice(0, 4);
  const importantEntities = (leadStory?.entities ?? []).flatMap((slug) => {
    const entity = snapshot.entities.find((candidate) => candidate.slug === slug);
    return entity ? [entity] : [];
  }).slice(0, 4);
  return <Shell><SeoHead title="Global AI News — Intelligence for the AI economy" description="Evidence-led reporting on what changed in the AI industry, why it matters, and where the source record is." path="/" /><main className={container}>
     <section className="border-b border-foreground/20 py-10 md:py-16">
       <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/15 pb-4">
         <p className="eyebrow text-primary">Global AI News · The evidence desk</p>
         {latestStory && <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Latest published · <time dateTime={latestStory.date}>{formatEditorialDate(latestStory.date)}</time></p>}
       </div>
       <div className="grid gap-10 pt-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
         <div className="flex flex-col justify-between">
           <div>
             <p className="eyebrow text-primary">Reporting that shows its work</p>
             <h1 className="mt-5 max-w-3xl font-serif text-[3.7rem] leading-[.83] tracking-[-.04em] sm:text-7xl md:text-[6.6rem]">Know what<br /><em className="text-primary">changed.</em></h1>
             <p className="mt-7 max-w-md text-lg leading-7 text-muted-foreground">What happened, why it matters, and the evidence that lets you check.</p>
           </div>
           {leadStory && <div className="mt-10 border-t border-foreground/15 pt-4">
             <p className="eyebrow text-primary">{leadStory.contentType ?? getReaderFacingContentType(leadStory.classification)} · {leadStory.category}</p>
             <Link href={`/article/${leadStory.slug}`} className="group block">
               <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-[.9] transition-colors group-hover:text-primary md:text-6xl">{leadStory.title}</h2>
               <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{leadStory.dek}</p>
             </Link>
             <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
               Published <time dateTime={leadStory.date}>{formatEditorialDate(leadStory.date)}</time>
               {leadStory.dateModified && leadStory.dateModified !== leadStory.date && <> · Updated <time dateTime={leadStory.dateModified}>{formatEditorialDate(leadStory.dateModified)}</time></>}
                {' · '}{getStoryReadTime(leadStory)} · Global AI News Editorial Desk
             </p>
           </div>}
         </div>
         {leadStory ? <aside aria-label="Evidence from the lead report" className="border border-foreground/15 bg-surface-muted/70 p-5 md:p-7">
           <div className="flex flex-wrap items-start justify-between gap-3 border-b border-foreground/15 pb-4">
             <div><p className="eyebrow text-primary">Evidence snapshot</p><p className="mt-2 max-w-sm font-serif text-2xl leading-tight">What the public record does—and doesn’t—establish</p></div>
             <span className="border border-foreground/20 px-2 py-1 font-mono text-[10px] uppercase tracking-widest">Not live inventory</span>
           </div>
           <div className="grid grid-cols-2 gap-4 border-b border-foreground/15 py-4 text-xs sm:grid-cols-3">
             <div><span className="eyebrow text-muted-foreground">Primary records</span><strong className="mt-1 block font-serif text-2xl">{leadStory.evidenceSummary.primarySources}</strong></div>
             <div><span className="eyebrow text-muted-foreground">Other confirmations</span><strong className="mt-1 block font-serif text-2xl">{leadStory.evidenceSummary.independentConfirmations}</strong></div>
             <div><span className="eyebrow text-muted-foreground">Confidence</span><strong className="mt-1 block font-mono text-sm">{leadStory.evidenceSummary.confidence}</strong></div>
           </div>
           {evidenceRows.length > 0 && <div className="pt-4">
             <div className="mb-2 flex items-center justify-between gap-2"><p className="eyebrow text-primary">Dated claims · separate stages</p><span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Reported date · source</span></div>
             <ol className="divide-y divide-foreground/10">
               {evidenceRows.map((item) => {
                 const source = snapshot.sources.find((candidate) => candidate.slug === item.sourceSlug);
                 return <li key={item.id} className="grid grid-cols-[1fr_auto] gap-3 py-3">
                    <div><p className="text-sm leading-tight">{item.quantityLabel} GPUs <span className="text-muted-foreground">· {item.status.replaceAll('-', ' ')}</span></p><p className="mt-1 text-xs text-muted-foreground">{source ? <Link href={`/source/${source.slug}`} className="underline decoration-foreground/30 underline-offset-2 hover:text-primary">{source.publisher || source.name}</Link> : 'Source record unavailable'} · <time dateTime={item.reportedOn}>{formatEditorialDate(item.reportedOn)}</time></p></div>
                   <span className="self-center font-mono text-[9px] uppercase tracking-wider text-primary">{item.sourceKind === 'primary' ? 'Primary' : 'Independent'}</span>
                 </li>;
               })}
             </ol>
           </div>}
           <p className="mt-4 text-xs leading-5 text-muted-foreground">{leadStory.evidenceSummary.note}</p>
           <div className="mt-5 grid gap-2 border-t border-foreground/15 pt-4 sm:grid-cols-2">
             <Link href={`/article/${leadStory.slug}`} className="flex items-center justify-between border border-foreground/15 bg-background px-3 py-3 text-sm hover:border-primary hover:text-primary"><span>Read the report</span><ArrowUpRight size={14} /></Link>
             {researchRecord && <Link href={`/research/${researchRecord.slug}`} className="flex items-center justify-between border border-foreground/15 bg-background px-3 py-3 text-sm hover:border-primary hover:text-primary"><span>Research record</span><ArrowUpRight size={14} /> </Link>}
             {dataProduct && <Link href={`/data/${dataProduct.slug}`} className="flex items-center justify-between border border-foreground/15 bg-background px-3 py-3 text-sm hover:border-primary hover:text-primary sm:col-span-2"><span>{dataProduct.title}</span><ArrowUpRight size={14} /></Link>}
           </div>
         </aside> : <p className="border border-foreground/15 p-6 text-sm text-muted-foreground">There are no published stories in the newsroom snapshot.</p>}
       </div>
     </section>
      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.75fr_1.25fr] md:py-16"><div><SectionLabel aside={`${topStories.length} stories`}>Latest</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">The useful read, not the loudest read.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">A running file of what moved, with the date and reporting attached.</p><Link href="/brief" className="mt-8 inline-flex min-h-11 items-center border-b border-primary pb-2 text-sm text-primary">Read the Daily Brief <ArrowUpRight size={14} className="ml-2" /></Link></div><div>{topStories.slice(0, 5).map((story, index) => <article key={story.slug} className="border-t border-foreground/15 py-5 first:border-t-0 first:pt-0"><div className="flex items-center gap-2"><span className="eyebrow text-primary">{story.category}</span><span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" /><time className="text-xs text-muted-foreground" dateTime={story.date}>{formatEditorialDate(story.date)}</time></div><Link href={`/article/${story.slug}`} className="mt-2 block max-w-2xl font-serif text-2xl leading-[.98] hover:text-primary md:text-3xl">{story.title}</Link><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{story.dek}</p></article>)}</div></section>

      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16">
        <div><SectionLabel aside={`${analysisStories.length} pieces`}>Analysis</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">What the evidence could mean next.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Interpretation, clearly distinguished from reported fact.</p><Link href="/essays" className="mt-7 inline-flex min-h-11 items-center text-sm text-primary hover:underline">More analysis and essays <ArrowUpRight size={14} className="ml-2" /></Link></div>
        <div className="border-t border-foreground/15">{analysisStories.slice(0, 3).map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} compact />)}{analysisStories.length === 0 && <p className="py-6 text-sm text-muted-foreground">No published analysis is available in this edition.</p>}</div>
      </section>

      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16">
        <div><SectionLabel aside={`${publishedResearch.length} records`}>Research</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">Show the method. Name the limits.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Questions, findings, methodology and limitations travel together.</p><Link href="/research" className="mt-7 inline-flex min-h-11 items-center text-sm text-primary hover:underline">Open the research register <ArrowUpRight size={14} className="ml-2" /></Link></div>
        <div className="border-t border-foreground/15">{publishedResearch.slice(0, 3).map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="group grid gap-3 border-b border-foreground/15 py-5 sm:grid-cols-[1fr_auto]"><span><span className="eyebrow text-primary">{record.provenance.replaceAll('-', ' ')} · {record.status}</span><span className="mt-2 block font-serif text-2xl leading-tight group-hover:text-primary">{record.title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{record.researchQuestion}</span></span><span className="font-mono text-[10px] text-muted-foreground">Updated {formatEditorialDate(record.updatedAt)}</span></Link>)}{publishedResearch.length === 0 && <p className="py-6 text-sm text-muted-foreground">No published research records are available yet.</p>}</div>
      </section>

      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16">
        <div><SectionLabel aside={`${reportStories.length} reports`}>Reports</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">Reference work for the longer question.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Maintained reports connect the story to its source and research records.</p><Link href="/reports" className="mt-7 inline-flex min-h-11 items-center text-sm text-primary hover:underline">Browse the report library <ArrowUpRight size={14} className="ml-2" /></Link></div>
        <div className="border-t border-foreground/15">{reportStories.slice(0, 3).map((story) => <StoryRow key={story.slug} slug={story.slug} compact />)}{reportStories.length === 0 && <p className="py-6 text-sm text-muted-foreground">No maintained reports are available in this edition.</p>}</div>
      </section>

      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16">
        <div><SectionLabel aside={`${publishedData.length} products`}>Data & intelligence</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">A record, not a live dashboard.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Dated observations retain their units, source wording and limits.</p><Link href="/data" className="mt-7 inline-flex min-h-11 items-center text-sm text-primary hover:underline">Explore data products <ArrowUpRight size={14} className="ml-2" /></Link></div>
        <div className="grid gap-px border border-foreground/15 bg-foreground/15 sm:grid-cols-2">{publishedData.slice(0, 4).map((product) => <Link key={product.slug} href={`/data/${product.slug}`} className="bg-background p-5 hover:bg-primary/[.035]"><span className="eyebrow text-primary">Data product · {product.status}</span><span className="mt-3 block font-serif text-2xl leading-tight">{product.title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{product.description}</span><span className="mt-4 block border-t border-foreground/10 pt-3 text-xs text-muted-foreground">{product.observations.length} dated observations · updated {formatEditorialDate(product.updatedAt)}</span></Link>)}{publishedData.length === 0 && <p className="bg-background p-6 text-sm text-muted-foreground sm:col-span-2">No published data products are available yet.</p>}</div>
      </section>

      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16">
        <div><SectionLabel>Topic pulse</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">Follow a subject through the record.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Topic pages bring related reporting and maintained records into one place.</p></div>
        <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-8">{pulseTopics.map((topic) => <Link key={topic.slug} href={topic.route} className="group border-t border-foreground/15 py-5"><span className="eyebrow text-primary">Topic file · {topic.storySlugs.length} linked stories</span><span className="mt-2 block font-serif text-3xl group-hover:text-primary">{topic.label}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{topic.description}</span></Link>)}{pulseTopics.length === 0 && <p className="border-t border-foreground/15 py-5 text-sm text-muted-foreground">No indexable topics are available.</p>}</div>
      </section>

      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16">
        <div><SectionLabel>Important entities</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">The people and systems behind the story.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Entities connected to the lead report, drawn from its published record.</p></div>
        <div className="grid gap-px border border-foreground/15 bg-foreground/15 sm:grid-cols-2">{importantEntities.map((entity) => <Link key={entity.slug} href={`/${entity.kind}/${entity.slug}`} className="bg-background p-5 hover:bg-primary/[.035]"><span className="eyebrow text-primary">{entity.kind}</span><span className="mt-6 block font-serif text-2xl">{entity.name}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{entity.strapline}</span></Link>)}{importantEntities.length === 0 && <p className="bg-background p-6 text-sm text-muted-foreground sm:col-span-2">No entity records are linked to the lead story.</p>}</div>
      </section>
      <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16">
        <div><SectionLabel>Deep dives</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">Stay with the question.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Long-form reporting, research and timelines make the surrounding record easier to inspect.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">{[...reportStories.slice(0, 1), ...orderedStories.filter((story) => story.contentType === 'Explainer' || story.contentType === 'Research').slice(0, 1)].map((story) => <Link key={story.slug} href={`/article/${story.slug}`} className="border border-foreground/15 p-5 hover:border-primary"><span className="eyebrow text-primary">{story.contentType ?? story.category} · {getStoryReadTime(story)}</span><span className="mt-5 block font-serif text-3xl leading-tight">{story.title}</span><span className="mt-3 block text-sm leading-6 text-muted-foreground">{story.dek}</span><span className="mt-5 inline-flex min-h-11 items-center text-sm text-primary">Read the story <ArrowUpRight size={14} className="ml-2" /></span></Link>)}</div>
      </section>
      <section className="grid gap-8 py-12 md:grid-cols-[.72fr_1.28fr] md:py-16"><div><SectionLabel>Return to the record</SectionLabel><h2 className="max-w-sm font-serif text-5xl leading-[.9]">A clear brief, when you need it.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">The Daily Brief brings the reporting into one considered edition.</p><Link href="/brief" className="mt-6 inline-flex min-h-11 items-center border-b border-primary pb-2 text-sm text-primary">Read today’s brief <ArrowUpRight size={14} className="ml-2" /></Link></div><Newsletter compact /></section>
    </main></Shell>;
}

export function BriefPage() {
  const [location] = useLocation();
  const snapshot = useNewsroomSnapshot();
  const latestStory = getLatestStory(snapshot.stories);
  const query = new URLSearchParams(location.split('?')[1] ?? '').get('q') ?? '';
  const results = useMemo(() => query ? snapshot.stories.filter((story) => `${story.title} ${story.dek} ${story.category}`.toLowerCase().includes(query.toLowerCase())) : snapshot.stories, [query, snapshot.stories]);
  return <Shell><SeoHead title="The Daily Brief — Global AI News" description="A three-minute editorial briefing on what changed across the AI economy." path="/brief" /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">{latestStory ? `Latest edition · ${formatEditorialDate(latestStory.date)} · ${snapshot.stories.length} stories` : 'No published edition'}</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">The Daily<br /><em className="text-primary">Brief.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">A three-minute read on the decisions, releases and quiet shifts changing the AI industry.</p></section>{query && <section className="border-b border-foreground/15 py-6"><p className="eyebrow text-primary">Search results for “{query}”</p>{results.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No result yet. Try an entity, desk or story title.</p>}</section>}<section className="grid gap-12 py-12 md:grid-cols-[1fr_280px]"><article>{results.map((story, index) => <div id={`brief-${index}`} key={story.slug}><StoryRow slug={story.slug} rank={index + 1} /></div>)}</article><aside className="md:border-l md:border-foreground/15 md:pl-7"><SectionLabel>{query ? 'Matching stories' : 'In this edition'}</SectionLabel><div className="grid gap-3 text-sm">{results.slice(0, 5).map((story, index) => <a href={`#brief-${index}`} key={story.slug} className="border-b border-foreground/15 pb-3 hover:text-primary">{String(index + 1).padStart(2, '0')} / {story.title}</a>)}</div><div className="mt-10 border-t border-foreground/15 pt-5"><p className="eyebrow text-muted-foreground">Editor’s note</p><p className="mt-3 text-sm leading-6">We separate reported fact, analysis and synthesis so you can move quickly without losing the thread.</p></div></aside></section><Newsletter compact /></main></Shell>;
}

export function SearchPage() {
  const [location, setLocation] = useLocation();
  const snapshot = useNewsroomSnapshot();
  const query = new URLSearchParams(location.split('?')[1] ?? '').get('q') ?? '';
  const [searchText, setSearchText] = useState(query);

  useEffect(() => setSearchText(query), [query]);

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return [];
    return snapshot.stories.filter((story) => {
      const author = getStoryAuthorIdentity(story, snapshot.authors);
      const relatedEntities = story.entities
        .map((slug) => snapshot.entities.find((entity) => entity.slug === slug)?.name ?? '')
        .join(' ');
      const searchableText = [
        story.title,
        story.dek,
        story.body.flatMap((section) => [section.heading, ...section.paragraphs]).join(' '),
        story.topic,
        story.category,
        author.name,
        relatedEntities,
      ].join(' ').toLocaleLowerCase();
      return searchableText.includes(term);
    });
  }, [query, snapshot.authors, snapshot.entities, snapshot.stories]);

  return <Shell><SeoHead title="Search — Global AI News" description="Search published Global AI News stories." path="/search" /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Search published stories</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">Find the<br /><em className="text-primary">record.</em></h1><form onSubmit={(event) => { event.preventDefault(); const nextQuery = searchText.trim(); setLocation(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : '/search'); }} className="mt-9 flex max-w-2xl gap-3 border-b border-foreground/40 py-3"><Search size={18} className="mt-1 text-primary" /><input data-testid="input-search-page" value={searchText} onChange={(event) => setSearchText(event.target.value)} aria-label="Search published stories" placeholder="Search stories, topics and authors" className="min-w-0 flex-1 bg-transparent outline-none" /><button data-testid="button-search-page" className="min-h-11 px-3 font-mono text-[10px] uppercase tracking-widest text-primary">Search</button></form></section><section className="grid gap-10 py-12 md:grid-cols-[1fr_280px]"><div>{query ? <><p className="eyebrow mb-5 text-primary">{results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”</p>{results.length ? results.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />) : <p className="border-t border-foreground/15 py-6 text-sm text-muted-foreground">No published stories match that search.</p>}</> : <p className="border-t border-foreground/15 py-6 text-sm text-muted-foreground">Enter a term to search published story titles, summaries, body text, topics, and authors.</p>}</div><aside className="md:border-l md:border-foreground/15 md:pl-7"><SectionLabel>Search scope</SectionLabel><p className="text-sm leading-6 text-muted-foreground">Results include published stories only. Editorial drafts and scheduled releases are not searchable here.</p></aside></section></main></Shell>;
}

export function EditorialInputPage({ title, path }: { title: string; path: string }) {
  const snapshot = useNewsroomSnapshot();
  const isArchive = path === '/archive';
  const isUnverifiedTrustPage = ['/about-us', '/code-of-ethics', '/corrections', '/contact-us'].includes(path);
  const copy = getEditorialPageCopy(path);
  const storiesByDate = [...snapshot.stories].sort((a, b) => b.date.localeCompare(a.date));
  return <Shell><SeoHead title={`${title} — Global AI News`} description={copy.description} path={path} indexable={!isUnverifiedTrustPage} /><main data-testid={isArchive ? 'published-archive' : `editorial-page-${path.slice(1)}`} className={`${container} min-h-[60vh] max-w-[1180px] py-14 md:py-20`}>
    <p className="eyebrow text-primary">{isArchive ? `${storiesByDate.length} published stories` : 'Global AI News · Editorial standards'}</p>
    <h1 className="mt-6 max-w-4xl font-serif text-6xl leading-[.88] md:text-8xl">{title}</h1>
    <p className="mt-7 max-w-3xl border-t border-foreground/15 pt-5 text-lg leading-8 text-muted-foreground">{copy.intro}</p>
    {isArchive ? <section className="mt-10"><SectionLabel>Published archive</SectionLabel>{storiesByDate.length ? storiesByDate.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />) : <p className="py-8 text-sm text-muted-foreground">No published stories are available in the current newsroom snapshot.</p>}</section> : <div className="mt-10 max-w-3xl">{copy.sections.map((section) => <section key={section.heading} className="border-t border-foreground/15 py-6"><h2 className="font-serif text-3xl">{section.heading}</h2><p className="mt-3 text-base leading-7 text-muted-foreground">{section.body}</p></section>)}</div>}
    {!isArchive && copy.relatedLinks?.length ? <nav data-testid="editorial-policy-links" aria-label="Related editorial pages" className="mt-8 flex max-w-3xl flex-wrap gap-3 border-t border-foreground/15 pt-6">{copy.relatedLinks.map((link) => <Link key={link.href} href={link.href} className="flex min-h-11 items-center gap-2 border border-foreground/15 px-4 text-sm hover:border-primary hover:text-primary">{link.label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}</nav> : null}
  </main></Shell>;
}

export function SignalsPage() {
  const snapshot = useNewsroomSnapshot();
  const [topic, setTopic] = useState('All signals');
  const topics = ['All signals', 'Models', 'Infrastructure', 'Research', 'Policy', 'India', 'Applications'];
  const visible = snapshot.signals.filter((signal) => topic === 'All signals' || signal.topic.toLowerCase() === topic.toLowerCase());
  return <Shell><SeoHead title="Signals on file — Global AI News" description="Dated editorial summaries linked to published reporting; not a live market feed or measurement series." path="/signals" /><main className={container}>
    <section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Dated editorial records</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">Signals<br /><em className="text-primary">on file.</em></h1><p className="mt-7 max-w-2xl text-lg leading-7 text-muted-foreground">These summaries are not live market measurements, current forecasts or continuously updated indices. Each card shows its maintained date and links to related reporting so you can inspect the source record.</p></section>
    <div className="flex flex-wrap gap-2 border-b border-foreground/15 py-5">{topics.map((item) => <button data-testid={`button-signal-filter-${item.toLowerCase().replace(/\s/g, '-')}`} type="button" key={item} onClick={() => setTopic(item)} aria-pressed={topic === item} className={`min-h-11 border px-3 font-mono text-[10px] uppercase tracking-widest ${topic === item ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20 hover:border-primary'}`}>{item}</button>)}</div>
    {visible.length ? <section className="grid gap-px border-x border-foreground/15 bg-foreground/15 md:grid-cols-2 lg:grid-cols-3">{visible.map((signal) => {
      const relatedStories = signal.stories.map((slug) => snapshot.stories.find((story) => story.slug === canonicalStorySlug(slug))).filter((story): story is Story => Boolean(story));
       const relatedSources = [...new Set(relatedStories.flatMap((story) => story.sources))]
         .flatMap((slug) => {
           const source = snapshot.sources.find((candidate) => candidate.slug === slug);
           return source ? [source] : [];
         });
       return <article data-testid={`card-signal-${signal.slug}`} key={signal.slug} className="flex flex-col bg-background p-6 md:p-8"><p className="eyebrow text-primary">{signal.topic}</p><h2 className="mt-4 font-serif text-2xl leading-tight">{signal.label}</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">{signal.summary}</p><p className="mt-6 border-t border-foreground/15 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Record updated <time dateTime={signal.updated}>{formatEditorialDate(signal.updated)}</time></p><div className="mt-auto pt-5"><p className="eyebrow text-muted-foreground">Related reporting</p>{relatedStories.length ? relatedStories.slice(0, 2).map((story) => <Link key={story.slug} href={`/article/${story.slug}`} className="mt-3 flex min-h-11 items-center justify-between gap-3 border-t border-foreground/10 py-2 text-sm hover:text-primary"><span>{story.title}</span><ArrowUpRight size={14} /></Link>) : <p className="mt-3 text-xs text-muted-foreground">No published story is linked in this snapshot.</p>}<div className="mt-4 border-t border-foreground/10 pt-4"><p className="eyebrow text-muted-foreground">Source records</p>{relatedSources.length ? relatedSources.slice(0, 3).map((source) => <Link key={source.slug} href={`/source/${source.slug}`} className="mt-2 flex min-h-11 items-center justify-between gap-3 text-xs leading-5 hover:text-primary"><span>{source.name}</span><ArrowUpRight size={13} /></Link>) : <p className="mt-2 text-xs text-muted-foreground">No source record is linked through the related reporting.</p>}</div></div></article>;
    })}</section> : <p className="border-b border-foreground/15 py-10 text-sm text-muted-foreground">No signal records are available for this filter.</p>}
  </main></Shell>;
}

export function ResearchPage({ essay = false }: { essay?: boolean }) {
  const snapshot = useNewsroomSnapshot();
  const researchStories = snapshot.stories.filter((story) =>
    ['Breakthroughs', 'Field Notes', 'Infrastructure'].includes(story.category),
  );

  return (
    <Shell>
      <SeoHead
        title={`${essay ? 'Essays' : 'Research & context'} — Global AI News`}
        description="Context for the AI economy."
        path={essay ? '/essays' : '/research'}
      />
      <main className={container}>
        <section className="grid gap-8 border-b border-foreground/20 py-14 md:grid-cols-[1fr_300px] md:py-20">
          <div>
            <p className="eyebrow text-primary">{essay ? 'Long-form desk' : 'Research desk'}</p>
            <h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[8rem]">
              {essay ? 'Essays.' : <>Context<br /><em className="text-primary">over noise.</em></>}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">
              {essay
                ? 'Arguments and field notes about what the AI industry is becoming.'
                : 'Research, analysis and explanatory work for readers who need the second-order view.'}
            </p>
          </div>
          <div className="border-t border-foreground/15 pt-4 text-sm leading-6 text-muted-foreground">
            Our desks distinguish reported facts, analysis and synthesis so readers can understand the status of each claim.
          </div>
        </section>
        <section className="grid gap-10 py-12 md:grid-cols-[1.15fr_.85fr]">
          <div>
            {essay
              ? snapshot.essays.map((item) => (
                  <article key={item.slug} className="border-t border-foreground/15 py-7">
                    <p className="eyebrow text-primary">Essay outline</p>
                    <h2 className="mt-3 block max-w-3xl font-serif text-4xl leading-[.9]">{item.title}</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{item.dek}</p>
                    <p className="mt-5 text-xs text-muted-foreground">
                      By Global AI News Editorial Desk · <time dateTime={item.date}>{formatEditorialDate(item.date)}</time>
                    </p>
                  </article>
                ))
              : researchStories.map((story, index) => (
                  <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />
                ))}
          </div>
          <aside>
            <SectionLabel>Entry points</SectionLabel>
            {['Model evaluation', 'AI in science', 'The infrastructure map', 'Public AI systems'].map((item, index) => (
              <div key={item} className="border-b border-foreground/15 py-4 text-sm">
                <span className="mr-3 font-mono text-primary">0{index + 1}</span>{item}
              </div>
            ))}
            <div className="mt-12"><Newsletter compact /></div>
          </aside>
        </section>
      </main>
    </Shell>
  );
}

export function IndustryPage() {
  const [layer, setLayer] = useState('All');
  const layers = ['All', 'Frontier Labs', 'Infrastructure', 'Models', 'Agents', 'Applications', 'Capital', 'Policy'];
  const nodes = layer === 'All' ? industryMap : industryMap.filter((node) => node.layer === layer);
  return <Shell><SeoHead title="AI Industry Map — Global AI News" description="A structured view of the AI ecosystem." path="/industry" /><main className={container}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Industry intelligence · 07 layers</p><h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">The AI<br /><em className="text-primary">industry map.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">See the relationships between frontier labs, infrastructure, models, agents, applications, capital and policy.</p></section><div className="flex flex-wrap gap-2 border-b border-foreground/15 py-5">{layers.map((item) => <button data-testid={`button-industry-${item.toLowerCase().replace(/\s/g, '-')}`} type="button" key={item} onClick={() => setLayer(item)} className={`min-h-11 border px-3 font-mono text-[10px] uppercase tracking-widest ${layer === item ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20 hover:border-primary'}`}>{item}</button>)}</div><section className="relative min-h-[440px] border border-foreground/15 bg-surface-muted p-6 md:min-h-[620px]"><div className="absolute inset-8 border border-primary/20" /><div className="absolute left-[15%] top-[24%] h-px w-[70%] rotate-[12deg] bg-primary/50" /><div className="absolute left-[21%] top-[60%] h-px w-[58%] rotate-[-9deg] bg-primary/40" />{nodes.map((node) => <Link data-testid={`link-industry-node-${node.slug}`} href="/industry" key={node.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${node.x}%`, top: `${node.y}%` }}><span className="block h-4 w-4 rounded-full border-2 border-primary bg-background hover:bg-primary" /><span className="mt-2 block w-28 text-center text-[10px] leading-3">{node.name}</span></Link>)}<div className="absolute bottom-6 left-6 max-w-sm"><p className="font-serif text-4xl leading-[.9]">Every layer changes the pressure on the next.</p><p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{nodes.length} nodes · {layer}</p></div></section><section className="grid gap-px border-x border-b border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-3">{nodes.map((node) => <article key={node.slug} className="bg-background p-6"><p className="eyebrow text-primary">{node.layer}</p><h2 className="mt-3 text-xl">{node.name}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{node.description}</p><p className="mt-5 border-t border-foreground/15 pt-3 text-xs"><b>Pressure:</b> {node.pressure}</p></article>)}</section></main></Shell>;
}

export function FocusIndexPage({ kind }: { kind: 'models' | 'policy' }) {
  const isModels = kind === 'models';
  const list = isModels ? entities.filter((entity) => entity.kind === 'model') : entities.filter((entity) => entity.kind === 'policy' || entity.slug === 'content-credentials');
  return <Shell><SeoHead title={`${isModels ? 'Models' : 'Policy'} intelligence — Global AI News`} description={`Focused ${kind} intelligence.`} path={`/${kind}`} /><main className={container}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">{isModels ? 'Model intelligence' : 'Policy intelligence'}</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{isModels ? <>Models<br /><em className="text-primary">in practice.</em></> : <>Policy<br /><em className="text-primary">in motion.</em></>}</h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">{isModels ? 'Capabilities, deployment economics and the systems behind the benchmark.' : 'Rules, standards and public infrastructure that make the AI economy legible.'}</p></section><section className="grid gap-12 py-12 md:grid-cols-[.7fr_1.3fr]"><div><SectionLabel>Focused index</SectionLabel><p className="max-w-sm text-sm leading-6 text-muted-foreground">Profiles are linked to stories, signals and timelines so the record stays connected.</p></div><div className="grid gap-px border bg-foreground/15 sm:grid-cols-2">{list.map((entity) => <Link href={`/${entity.kind}/${entity.slug}`} key={entity.slug} className="bg-background p-7 hover:bg-primary hover:text-primary-foreground"><p className="eyebrow opacity-60">{entity.kind}</p><h2 className="mt-10 font-serif text-3xl leading-none">{entity.name}</h2><p className="mt-3 text-sm opacity-70">{entity.strapline}</p></Link>)}</div></section></main></Shell>;
}

export function IndiaPage() {
  const snapshot = useNewsroomSnapshot();
  const indiaStories = snapshot.stories.filter((story) => story.topic === 'India');
  const policyEntities = snapshot.entities.filter((entity) => entity.kind === 'policy');

  return (
    <Shell>
      <SeoHead
        title="India AI Index — Global AI News"
        description="Dated, sourced indicators for India’s public AI compute and operating data-centre capacity."
        path="/india"
      />
      <main className={container}>
        <section className="grid gap-10 border-b border-foreground/20 py-14 md:grid-cols-[1fr_.7fr] md:py-20">
          <div>
            <p className="eyebrow text-primary">Regional intelligence · India</p>
            <h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">
              India<br /><em className="text-primary">in build mode.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">
              A source-linked view of public compute reporting and operating data-centre capacity, with dates and scope kept explicit.
            </p>
          </div>
          <div className="border-l border-foreground/15 pl-6 md:pl-10">
            <p className="eyebrow text-muted-foreground">Index thesis</p>
            <p className="mt-5 font-serif text-3xl leading-none">
              A public infrastructure claim is useful only when its status is clear.
            </p>
          </div>
        </section>
        <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.55fr_1.45fr]">
          <div>
            <SectionLabel>Dated infrastructure indicators</SectionLabel>
            <p className="text-sm leading-6 text-muted-foreground">
              These measures describe different things: shared GPU capacity and all-workload data-centre operating stock. Neither is a live availability feed.
            </p>
          </div>
          <div className="grid gap-px border bg-foreground/15 sm:grid-cols-2">
            {snapshot.indiaIndex.map((metric) => {
              const source = snapshot.sources.find((record) => record.slug === metric.source);
              return (
                <article data-testid={`metric-india-${metric.slug}`} key={metric.slug} className="bg-background p-6">
                  <p className="eyebrow text-primary">{metric.label}</p>
                  <p className="mt-7 font-serif text-4xl">{metric.value}</p>
                  <p className="mt-2 text-xs text-primary">{metric.change}</p>
                  <p className="mt-3 text-sm leading-5 text-muted-foreground">{metric.context}</p>
                  {source
                    ? (
                      <Link href={`/source/${source.slug}`} className="mt-4 flex min-h-11 items-center gap-2 border-t border-foreground/10 pt-3 text-xs hover:text-primary">
                        {source.publisher} · source record <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    )
                    : (
                      <p className="mt-4 border-t border-foreground/10 pt-3 text-xs text-muted-foreground">
                        Source record unavailable in this snapshot.
                      </p>
                    )}
                </article>
              );
            })}
          </div>
        </section>
        <section className="grid gap-10 py-12 md:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel>Stories from India</SectionLabel>
            {indiaStories.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}
          </div>
          <div>
            <SectionLabel>Government initiatives</SectionLabel>
            <div className="border-t border-foreground/15">
              {policyEntities.map((entity) => (
                <Link href={`/${entity.kind}/${entity.slug}`} key={entity.slug} className="block border-b border-foreground/15 py-5 hover:text-primary">
                  <p className="font-serif text-2xl">{entity.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{entity.strapline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <Newsletter compact />
      </main>
    </Shell>
  );
}

export function AskPage() {
  const snapshot = useNewsroomSnapshot();
  const answers = snapshot.askGlobalAnswers;
  const [selectedSlug, setSelectedSlug] = useState(answers[0]?.slug ?? '');
  const [question, setQuestion] = useState('');
  const selected = answers.find((item) => item.slug === selectedSlug) ?? answers[0];
  const answer = (question
    ? answers.find((item) => item.question.toLowerCase() === question.toLowerCase())
    : selected) ?? selected;

  if (!answer) {
    return <Shell><SeoHead title="Ask Global — Global AI News" description="An intelligence interface for asking what changed." path="/ask" /><main className={container}><p className="py-20 text-sm text-muted-foreground">No sourced answers are available in this snapshot.</p></main></Shell>;
  }

  return <Shell><SeoHead title="Ask Global — Global AI News" description="An intelligence interface for asking what changed." path="/ask" /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Ask Global · intelligence interface</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">Ask what<br /><em className="text-primary">changed.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">Answers grounded in Global AI News stories, sources, timelines and entities — not a generic chatbot.</p><form onSubmit={(event) => { event.preventDefault(); const found = answers.find((item) => item.question.toLowerCase().includes(question.toLowerCase())); if (found) setSelectedSlug(found.slug); }} className="mt-9 flex max-w-2xl gap-2 border-b border-foreground/40 py-3"><Search size={18} className="mt-1 text-primary" /><input data-testid="input-ask-global" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What do you want to understand?" className="min-w-0 flex-1 bg-transparent outline-none" /><button data-testid="button-ask-global" className="font-mono text-[10px] uppercase tracking-widest text-primary">Ask</button></form></section><section className="grid gap-10 py-12 md:grid-cols-[.7fr_1.3fr]"><aside><SectionLabel>Start here</SectionLabel><div className="grid gap-2">{answers.map((item) => <button data-testid={`button-ask-example-${item.slug}`} type="button" key={item.slug} onClick={() => { setSelectedSlug(item.slug); setQuestion(item.question); }} className={`border-b border-foreground/15 py-4 text-left text-sm hover:text-primary ${selected.slug === item.slug ? 'text-primary' : ''}`}>{item.question}</button>)}</div></aside><article className="border-l border-foreground/15 pl-0 md:pl-10"><p className="eyebrow text-primary">Answer · as of <time dateTime={answer.asOf}>{formatEditorialDate(answer.asOf)}</time></p><h2 data-testid="text-ask-question" className="mt-4 font-serif text-4xl leading-[.9]">{answer.question}</h2><p data-testid="text-ask-answer" className="mt-7 max-w-2xl text-lg leading-8">{answer.answer}</p><div className="mt-10 grid gap-8 border-t border-foreground/15 pt-6 sm:grid-cols-3"><div><p className="eyebrow text-muted-foreground">Stories</p><div className="mt-3 grid gap-2">{answer.citedStories.map((slug) => <Link href={storyHref(slug)} key={slug} className="text-sm hover:text-primary">{snapshot.stories.find((story) => story.slug === canonicalStorySlug(slug))?.title ?? slug}</Link>)}</div></div><div><p className="eyebrow text-muted-foreground">Entities</p><div className="mt-3 grid gap-2">{answer.citedEntities.map((slug) => { const entity = snapshot.entities.find((candidate) => candidate.slug === slug); return entity ? <Link href={`/${entity.kind}/${slug}`} key={slug} className="text-sm hover:text-primary">{entity.name}</Link> : null; })}</div></div><div><p className="eyebrow text-muted-foreground">Sources</p><div className="mt-3 grid gap-2">{answer.citedSources.map((slug) => { const source = snapshot.sources.find((candidate) => candidate.slug === slug); return <a href={source?.url} target="_blank" rel="noreferrer" key={slug} className="text-sm hover:text-primary">{source?.publisher ?? slug} <ArrowUpRight size={12} className="inline" /></a>; })}</div></div></div><div className="mt-8"><SectionLabel>Timeline</SectionLabel><TimelineList slugs={answer.citedTimeline} /></div></article></section></main></Shell>;
}

export function ArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const snapshot = useNewsroomSnapshot();
  const story = snapshot.stories.find((candidate) => candidate.slug === slug);
  if (!story) return <NotFound />;
  const author = getStoryAuthorIdentity(story, snapshot.authors);
  const publicDateModified = getPublicDateModified(story);
  const sectionIndex = story.contentType === 'Report' ? '/reports' : '/research';
  const sectionLabel = story.contentType === 'Report' ? 'Reports' : 'Research';
  const researchRecords = snapshot.researchRecords.filter((record) => record.status === 'published' && (record.storySlug === story.slug || record.relatedStorySlugs.includes(story.slug)));
  const dataProducts = snapshot.dataProducts.filter((product) => product.status === 'published' && product.storySlugs.includes(story.slug));
  return <Shell>
    <SeoHead article title={`${story.title} — Global AI News`} description={story.dek} path={`/article/${story.slug}`} />
    <main className={`${container} max-w-[1180px]`}>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center pt-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Link href="/">Home</Link><span className="mx-2">/</span><Link href={sectionIndex}>{sectionLabel}</Link><span className="mx-2">/</span><span>{story.category}</span><span className="mx-2">/</span><span aria-current="page" className="max-w-[22rem] truncate">{story.title}</span>
      </nav>
      <header className="max-w-5xl py-10 md:py-16">
        <p className="eyebrow text-primary">{story.category} · {story.contentType ?? getReaderFacingContentType(story.classification)}</p>
        <h1 className="mt-5 font-serif text-6xl leading-[.84] tracking-[-.03em] md:text-[7.8rem]">{story.title}</h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-muted-foreground">{story.dek}</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-foreground/15 py-4 text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {author.type === 'Person' && author.slug
              ? <span>By <Link data-testid="link-article-author" href={`/person/${author.slug}`} className="font-semibold underline decoration-foreground/30 underline-offset-2 hover:text-primary">{author.name}</Link> · {snapshot.authors.find((item) => item.slug === author.slug)?.role}</span>
              : <span data-testid="text-article-author" className="max-w-lg"><span>{`By ${author.name}`}</span>{author.description && <span data-testid="text-author-description" className="mt-1 block max-w-md text-[11px] leading-5 text-muted-foreground">{author.description}</span>}</span>}
            <span aria-hidden="true">·</span><span>Published <time dateTime={story.date}>{formatEditorialDate(story.date)}</time></span>
            {publicDateModified && publicDateModified !== story.date && <><span aria-hidden="true">·</span><span>Updated <time dateTime={publicDateModified}>{formatEditorialDate(publicDateModified)}</time></span></>}
            <span aria-hidden="true">·</span><span>{getStoryReadTime(story)}</span>
          </div>
          <div className="flex gap-2">
            <button data-testid="button-article-bookmark" type="button" onClick={() => setSaved(!saved)} className="border border-foreground/20 px-3 py-2 hover:border-primary">{saved ? 'Saved' : 'Save'}</button>
            <button data-testid="button-article-share" type="button" onClick={async () => { setShared(true); if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href); }} className="flex items-center gap-2 border border-foreground/20 px-3 py-2 hover:border-primary"><Share2 size={14} />{shared ? 'Copied' : 'Share'}</button>
          </div>
        </div>
      </header>
      <EditorialImage large treatment={story.imageTreatment.type} alt={story.imageTreatment.alt} caption={story.imageTreatment.caption} />
      <div className="grid gap-12 py-12 md:grid-cols-[minmax(0,740px)_280px]">
        <article className="prose prose-lg max-w-none min-w-0 prose-headings:font-serif prose-headings:font-normal prose-p:leading-8 prose-p:text-foreground/85">
          <section className="not-prose border-l-2 border-primary bg-secondary/50 p-6"><p className="eyebrow text-primary">The bottom line</p><p className="mt-3 font-serif text-3xl leading-none"><StoryCitedText text={story.bottomLine} story={story} sources={snapshot.sources} /></p></section>
          <section className="not-prose mt-10"><p className="eyebrow text-primary">Why this matters</p><p className="mt-3 text-lg leading-8"><StoryCitedText text={story.whyItMatters} story={story} sources={snapshot.sources} /></p></section>
          <section className="not-prose mt-10 border-y border-foreground/15 py-6"><p className="eyebrow text-primary">Key takeaways</p><ul className="mt-4 grid gap-3 text-sm">{story.keyTakeaways.map((item) => <li key={item} className="flex gap-3"><span className="text-primary">—</span><span><StoryCitedText text={item} story={story} sources={snapshot.sources} /></span></li>)}</ul></section>
          <StoryBody story={story} sources={snapshot.sources} />
          <section className="not-prose mt-10 border-t border-foreground/15 pt-6"><p className="eyebrow text-primary">What changes</p><p className="mt-3 text-lg leading-8"><StoryCitedText text={story.whatChanges} story={story} sources={snapshot.sources} /></p></section>
          {story.sources.length > 0 && <StorySourceList story={story} sources={snapshot.sources} />}
        </article>
        <aside className="space-y-10"><EvidencePanel storySlug={story.slug} /><section><SectionLabel>Related entities</SectionLabel><EntityLinks slugs={story.entities} /></section><section><SectionLabel>Timeline</SectionLabel><TimelineList slugs={story.timeline} /></section><section><SectionLabel>Source records</SectionLabel><div className="grid gap-3">{story.sources.map((sourceSlug) => { const source = snapshot.sources.find((item) => item.slug === sourceSlug); return source ? <Link key={sourceSlug} href={`/source/${sourceSlug}`} className="border-b border-foreground/15 pb-3 text-sm hover:text-primary">{source.name}<span className="mt-1 block text-xs text-muted-foreground">{source.publisher} · citation detail</span></Link> : null; })}</div></section></aside>
      </div>
      {story.relatedStories.length > 0 && <section className="border-t border-foreground/15 py-12"><SectionLabel>Next stories</SectionLabel><div className="grid gap-6 md:grid-cols-3">{story.relatedStories.map((relatedSlug) => <StoryRow key={relatedSlug} slug={relatedSlug} />)}</div></section>}
      {(researchRecords.length > 0 || dataProducts.length > 0) && <section className="grid gap-10 border-t border-foreground/15 py-10 md:grid-cols-2">
        {researchRecords.length > 0 && <div><SectionLabel>Research record</SectionLabel>{researchRecords.map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="block border-b border-foreground/15 py-4 hover:text-primary"><span className="font-serif text-2xl">{record.title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{record.researchQuestion}</span></Link>)}</div>}
        {dataProducts.length > 0 && <div><SectionLabel>Reusable data</SectionLabel>{dataProducts.map((product) => <Link key={product.slug} href={`/data/${product.slug}`} className="block border-b border-foreground/15 py-4 hover:text-primary"><span className="font-serif text-2xl">{product.title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{product.description}</span></Link>)}</div>}
      </section>}
      <Newsletter compact />
    </main>
  </Shell>;
}

export function EntityPage({ kind }: { kind: string }) {
  const { slug = '' } = useParams<{ slug: string }>();
  const snapshot = useNewsroomSnapshot();
  const authorRecord = kind === 'person' ? snapshot.authors.find((item) => item.slug === slug) : undefined;
  const person = authorRecord?.verifiedForPublication === true ? authorRecord : undefined;
  const entity = authorRecord && authorRecord.verifiedForPublication !== true
    ? undefined
    : snapshot.entities.find((item) => item.kind === kind && item.slug === slug);
  if (person) {
    const authored = snapshot.stories.filter((story) => story.author === person.slug);
    const authoredResearch = snapshot.researchRecords.filter((record) => record.status === 'published' && record.authorSlug === person.slug && snapshot.stories.some((story) => story.slug === record.storySlug));
    return <Shell><SeoHead title={`${person.name} — Global AI News`} description={person.bio} path={`/person/${slug}`} /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-16 md:py-24"><p className="eyebrow text-primary">People intelligence · contributor profile</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{person.name}</h1><p className="mt-6 text-xl text-muted-foreground">{person.role} · {person.location}</p><p className="mt-7 max-w-2xl text-lg leading-8">{person.bio}</p></section><section className="grid gap-10 py-12 md:grid-cols-[.65fr_1.35fr]"><div><SectionLabel>Recent work</SectionLabel>{authored.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />)}{authoredResearch.map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="block border-t border-foreground/15 py-4 font-serif text-xl hover:text-primary">{record.title}<span className="mt-1 block font-sans text-xs text-muted-foreground">Published research record</span></Link>)}</div><aside><SectionLabel>About the desk</SectionLabel><p className="text-sm leading-7">Global AI News contributors connect reported stories to the entities, sources and timelines that make the industry understandable.</p></aside></section></main></Shell>;
  }
  if (!entity) return <NotFound />;
  const entityResearch = snapshot.researchRecords.filter((record) => record.status === 'published' && record.entitySlugs.includes(slug) && snapshot.stories.some((story) => story.slug === record.storySlug));
  const entityData = snapshot.dataProducts.filter((record) => record.status === 'published' && record.entitySlugs.includes(slug) && record.storySlugs.some((storySlug) => snapshot.stories.some((story) => story.slug === storySlug)));
  const entityTopics = snapshot.topics.filter((record) => record.indexable && record.entitySlugs.includes(slug) && record.storySlugs.some((storySlug) => snapshot.stories.some((story) => story.slug === storySlug)));
  const entitySources = [...new Set([...entityResearch.flatMap((record) => record.sourceSlugs), ...entityData.flatMap((record) => record.sourceSlugs)])].flatMap((sourceSlug) => { const source = snapshot.sources.find((item) => item.slug === sourceSlug); return source ? [{ sourceSlug, source }] : []; });
  return <Shell><SeoHead title={`${entity.name} — Global AI News`} description={entity.overview} path={`/${kind}/${slug}`} /><main className={`${container} max-w-[1280px]`}>
    <section className="grid gap-10 border-b border-foreground/20 py-14 md:grid-cols-[1fr_.65fr] md:py-20"><div><p className="eyebrow text-primary">{entity.kind} intelligence · profile</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{entity.name}</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">{entity.strapline}</p><p className="mt-7 max-w-2xl text-sm leading-7">{entity.overview}</p></div><div className="border-l border-foreground/15 pl-6 md:pl-10"><p className="eyebrow text-muted-foreground">At a glance</p>{entity.headquarters && <p className="mt-5 border-b border-foreground/15 pb-3 text-sm"><span className="text-muted-foreground">Based in</span><br />{entity.headquarters}</p>}{entity.founded && <p className="border-b border-foreground/15 py-3 text-sm"><span className="text-muted-foreground">Founded</span><br />{entity.founded}</p>}</div></section>
    <section className="grid gap-10 border-b border-foreground/15 py-12 md:grid-cols-[.65fr_1.35fr]"><div><SectionLabel>Key metrics</SectionLabel>{entity.keyMetrics.map((metric) => <div key={metric.label} className="border-b border-foreground/15 py-4"><p className="eyebrow text-primary">{metric.label}</p><p className="mt-2 font-serif text-3xl">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.context}</p></div>)}</div><div><SectionLabel>Latest developments</SectionLabel>{entity.latestDevelopments.map((item) => <p key={item} className="border-b border-foreground/15 py-4 text-sm leading-6">{item}</p>)}<div className="mt-8"><SectionLabel>Related organizations</SectionLabel><EntityLinks slugs={entity.relatedOrganizations} /></div></div></section>
    <section className="grid gap-10 border-b border-foreground/15 py-12 md:grid-cols-2"><div><SectionLabel>Recent reporting</SectionLabel>{entity.recentStories.map((storySlug, index) => <StoryRow key={storySlug} slug={storySlug} rank={index + 1} compact />)}</div><div><SectionLabel>Timeline</SectionLabel><TimelineList slugs={entity.timeline} /></div></section>
    {(entityResearch.length || entityData.length || entityTopics.length || entitySources.length) > 0 && <section className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {entityResearch.length > 0 && <div><SectionLabel>Research</SectionLabel>{entityResearch.map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{record.title}</Link>)}</div>}
      {entityData.length > 0 && <div><SectionLabel>Data products</SectionLabel>{entityData.map((record) => <Link key={record.slug} href={`/data/${record.slug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{record.title}</Link>)}</div>}
      {entityTopics.length > 0 && <div><SectionLabel>Topics</SectionLabel>{entityTopics.map((record) => <Link key={record.slug} href={record.route} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{record.label}</Link>)}</div>}
      {entitySources.length > 0 && <div><SectionLabel>Cited sources</SectionLabel>{entitySources.map(({ sourceSlug, source }) => <Link key={sourceSlug} href={`/source/${sourceSlug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{source.name}</Link>)}</div>}
    </section>}
  </main></Shell>;
  /*
  return <Shell><SeoHead title={`${entity.name} — Global AI News`} description={entity.overview} path={`/${kind}/${slug}`} /><main className={container}><section className="grid gap-10 border-b border-foreground/20 py-14 md:grid-cols-[1fr_.65fr] md:py-20"><div><p className="eyebrow text-primary">{entity.kind} intelligence · profile</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{entity.name}</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">{entity.strapline}</p><p className="mt-7 max-w-2xl text-sm leading-7">{entity.overview}</p></div><div className="border-l border-foreground/15 pl-6 md:pl-10"><p className="eyebrow text-muted-foreground">At a glance</p>{entity.headquarters && <p className="mt-5 border-b border-foreground/15 pb-3 text-sm"><span className="text-muted-foreground">Based in</span><br />{entity.headquarters}</p>}{entity.founded && <p className="border-b border-foreground/15 py-3 text-sm"><span className="text-muted-foreground">Founded</span><br />{entity.founded}</p>}</div></section><section className="grid gap-10 py-12 md:grid-cols-[.65fr_1.35fr]"><div><SectionLabel>Key metrics</SectionLabel><div className="grid gap-4">{entity.keyMetrics.map((metric) => <div key={metric.label} className="border-b border-foreground/15 pb-4"><p className="eyebrow text-primary">{metric.label}</p><p className="mt-2 font-serif text-3xl">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.context}</p></div>)}</div></div><div><SectionLabel>Latest developments</SectionLabel><ul className="grid gap-4 text-lg">{entity.latestDevelopments.map((item) => <li key={item} className="border-b border-foreground/15 pb-4">{item}</li>)}</ul><div className="mt-12"><SectionLabel>Signals</SectionLabel><div className="flex flex-wrap gap-3">{entity.signals.map((slug) => <Link href="/signals" key={slug} className="border border-foreground/20 px-3 py-2 text-sm hover:border-primary">{signals.find((signal) => signal.slug === slug)?.label ?? slug}</Link>)}</div></div></div></section><section className="grid gap-10 border-t border-foreground/15 py-12 md:grid-cols-2"><div><SectionLabel>Related organizations</SectionLabel><EntityLinks slugs={entity.relatedOrganizations} /></div><div><SectionLabel>Recent stories</SectionLabel>{entity.recentStories.map((slug, index) => <StoryRow key={slug} slug={slug} rank={index + 1} compact />)}</div></section><section className="border-t border-foreground/15 py-12"><SectionLabel>Timeline</SectionLabel><TimelineList slugs={entity.timeline} /></section></main></Shell>;
  return <Shell><SeoHead title={`${entity.name} — Global AI News`} description={entity.overview} path={`/${kind}/${slug}`} /><main className={container}><section className="grid gap-10 border-b border-foreground/20 py-14 md:grid-cols-[1fr_.65fr] md:py-20"><div><p className="eyebrow text-primary">{entity.kind} intelligence · profile</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{entity.name}</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">{entity.strapline}</p><p className="mt-7 max-w-2xl text-sm leading-7">{entity.overview}</p></div><div className="border-l border-foreground/15 pl-6 md:pl-10"><p className="eyebrow text-muted-foreground">At a glance</p>{entity.headquarters && <p className="mt-5 border-b border-foreground/15 pb-3 text-sm"><span className="text-muted-foreground">Based in</span><br />{entity.headquarters}</p>}{entity.founded && <p className="border-b border-foreground/15 py-3 text-sm"><span className="text-muted-foreground">Founded</span><br />{entity.founded}</p>}</div></section><section className="grid gap-10 py-12 md:grid-cols-[.65fr_1.35fr]"><div><SectionLabel>Key metrics</SectionLabel><div className="grid gap-4">{entity.keyMetrics.map((metric) => <div key={metric.label} className="border-b border-foreground/15 pb-4"><p className="eyebrow text-primary">{metric.label}</p><p className="mt-2 font-serif text-3xl">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.context}</p></div>)}</div></div><div><SectionLabel>Latest developments</SectionLabel><ul className="grid gap-4 text-lg">{entity.latestDevelopments.map((item) => <li key={item} className="border-b border-foreground/15 pb-4">{item}</li>)}</ul><div className="mt-12"><SectionLabel>Signals</SectionLabel><div className="flex flex-wrap gap-3">{entity.signals.map((slug) => <Link href="/signals" key={slug} className="border border-foreground/20 px-3 py-2 text-sm hover:border-primary">{signals.find((signal) => signal.slug === slug)?.label ?? slug}</Link>)}</div></div></section><section className="grid gap-10 border-t border-foreground/15 py-12 md:grid-cols-2"><div><SectionLabel>Related organizations</SectionLabel><EntityLinks slugs={entity.relatedOrganizations} /></div><div><SectionLabel>Recent stories</SectionLabel>{entity.recentStories.map((slug, index) => <StoryRow key={slug} slug={slug} rank={index + 1} compact />)}</div></section>
    {(entityResearch.length || entityData.length || entityTopics.length || entitySources.length) > 0 && <section className="grid gap-8 border-t border-foreground/15 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {entityResearch.length > 0 && <div><SectionLabel>Research</SectionLabel>{entityResearch.map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{record.title}</Link>)}</div>}
      {entityData.length > 0 && <div><SectionLabel>Data products</SectionLabel>{entityData.map((record) => <Link key={record.slug} href={`/data/${record.slug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{record.title}</Link>)}</div>}
      {entityTopics.length > 0 && <div><SectionLabel>Topics</SectionLabel>{entityTopics.map((record) => <Link key={record.slug} href={record.route} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{record.label}</Link>)}</div>}
      {entitySources.length > 0 && <div><SectionLabel>Cited sources</SectionLabel>{entitySources.map(({ sourceSlug, source }) => <Link key={sourceSlug} href={`/source/${sourceSlug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{source.name}</Link>)}</div>}
    </section>}
    <section className="border-t border-foreground/15 py-12"><SectionLabel>Timeline</SectionLabel><TimelineList slugs={entity.timeline} /></section></main></Shell>;
}

  */
}

export function TimelinePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const event = findTimeline(slug);
  if (!event) return <NotFound />;
  const snapshot = useNewsroomSnapshot();
  const research = snapshot.researchRecords.filter((record) => record.status === 'published' && record.timelineSlugs.includes(slug));
  const products = snapshot.dataProducts.filter((record) => record.status === 'published' && record.timelineSlugs.includes(slug));
  const sourcesForEvent = event.sourceSlugs ?? [];
  const topicsForEvent = event.topicSlugs ?? [];
  return <Shell><SeoHead title={`${event.title} — Global AI News`} description={event.description} path={`/timeline/${slug}`} /><main className={`${container} max-w-[1180px]`}><section className="border-b border-foreground/20 py-16 md:py-24"><p className="eyebrow text-primary">Timeline event · {event.date}</p><h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[8rem]">{event.title}</h1><p className="mt-8 max-w-2xl text-xl leading-8 text-muted-foreground">{event.description}</p></section><section className="grid gap-12 py-12 md:grid-cols-[1fr_300px]"><div><SectionLabel>Connected record</SectionLabel><p className="text-lg leading-8">This event sits inside a living chronology of the people, companies, models and policy decisions shaping the industry.</p>{event.story && <div className="mt-10"><SectionLabel>Read the story</SectionLabel><StoryRow slug={event.story} /></div>}<div className="mt-10 grid gap-8 sm:grid-cols-2">{research.length > 0 && <div><SectionLabel>Research</SectionLabel>{research.map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{record.title}</Link>)}</div>}{products.length > 0 && <div><SectionLabel>Data products</SectionLabel>{products.map((product) => <Link key={product.slug} href={`/data/${product.slug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{product.title}</Link>)}</div>}</div></div><aside className="space-y-8"><div><SectionLabel>Entities</SectionLabel><EntityLinks slugs={event.entities} /></div>{topicsForEvent.length > 0 && <div><SectionLabel>Topics</SectionLabel>{topicsForEvent.map((topicSlug) => { const topic = snapshot.topics.find((item) => item.slug === topicSlug); return topic ? <Link key={topicSlug} href={topic.route} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{topic.label}</Link> : null; })}</div>}{sourcesForEvent.length > 0 && <div><SectionLabel>Sources</SectionLabel>{sourcesForEvent.map((sourceSlug) => { const source = snapshot.sources.find((item) => item.slug === sourceSlug); return source ? <Link key={sourceSlug} href={`/source/${sourceSlug}`} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{source.name}</Link> : null; })}</div>}</aside></section></main></Shell>;
}

export function TopicPage({ kind }: { kind: 'ai' | 'india' }) {
  const snapshot = useNewsroomSnapshot();
  const topic = snapshot.topics.find((record) => record.slug === kind);
  const list = (topic?.storySlugs ?? []).map((slug) => snapshot.stories.find((story) => story.slug === slug)).filter((story): story is Story => Boolean(story));
  const topicEntityLinks = (topic?.entitySlugs ?? []).flatMap((slug) => { const entity = snapshot.entities.find((item) => item.slug === slug); return entity && ['company', 'lab', 'model', 'person', 'technology', 'institution', 'policy', 'dataset', 'infrastructure'].includes(entity.kind) ? [{ href: `/${entity.kind}/${slug}`, label: entity.name }] : []; });
  const sourcesForTopic = (topic?.sourceSlugs ?? []).flatMap((slug) => { const source = snapshot.sources.find((item) => item.slug === slug); return source ? [{ href: `/source/${slug}`, label: source.name }] : []; });
  const topicResearch = (topic?.researchSlugs ?? []).flatMap((slug) => { const record = snapshot.researchRecords.find((item) => item.slug === slug && item.status === 'published'); return record ? [{ href: `/research/${slug}`, label: record.title }] : []; });
  const topicData = (topic?.dataProductSlugs ?? []).flatMap((slug) => { const product = snapshot.dataProducts.find((item) => item.slug === slug && item.status === 'published'); return product ? [{ href: `/data/${slug}`, label: product.title }] : []; });
  const topicReports = (topic?.reportSlugs ?? []).flatMap((slug) => { const report = snapshot.stories.find((item) => item.slug === slug && item.contentType === 'Report'); return report ? [{ href: `/article/${slug}`, label: report.title }] : []; });
  const topicEvents = (topic?.timelineSlugs ?? []).flatMap((slug) => { const event = snapshot.timelineEvents.find((item) => item.slug === slug); return event ? [{ href: `/timeline/${slug}`, label: event.title, date: event.date }] : []; });
  return <Shell><SeoHead title={`${topic?.label ?? (kind === 'ai' ? 'Artificial intelligence' : 'India Watch')} — Global AI News`} description={topic?.description ?? 'A focused Global AI News desk.'} path={`/topic/${kind}`} /><main className={container}><section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Connected topic · {topic?.label ?? kind}</p><h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{kind === 'ai' ? <>Artificial<br /><em className="text-primary">intelligence.</em></> : <>India<br /><em className="text-primary">Watch.</em></>}</h1><p className="mt-7 max-w-2xl text-lg leading-7 text-muted-foreground">{topic?.description ?? 'This topic record is not available in the current newsroom snapshot.'}</p><p className="mt-5 eyebrow text-muted-foreground">{topic?.indexable ? 'Published topic record' : 'Topic record · not currently indexable'}</p></section>
    {topic ? <><section className="grid gap-10 py-12 md:grid-cols-[.55fr_1.45fr]"><div><SectionLabel aside={`${list.length} stories`}>Important developments</SectionLabel><p className="text-sm leading-6 text-muted-foreground">This hub follows the newsroom’s maintained relationships between reporting, research, sources and events.</p></div><div className="border-t border-foreground/15">{topic.importantDevelopments.map((development, index) => <p key={`${index}-${development}`} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-foreground/15 py-4 text-sm"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')}</span><span>{development}</span></p>)}</div></section>
      <section className="grid gap-12 border-y border-foreground/15 py-12 md:grid-cols-[1fr_300px]"><div><SectionLabel>Reporting</SectionLabel>{list.length ? list.map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} />) : <p className="border-t border-foreground/15 py-5 text-sm text-muted-foreground">No stories are linked to this topic in the current snapshot.</p>}</div>
        <aside className="space-y-8">
          {topicResearch.length > 0 && <div><SectionLabel>Research</SectionLabel>{topicResearch.map((item) => <Link href={item.href} key={item.href} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{item.label}</Link>)}</div>}
          {topicData.length > 0 && <div><SectionLabel>Data products</SectionLabel>{topicData.map((item) => <Link href={item.href} key={item.href} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{item.label}</Link>)}</div>}
          {topicReports.length > 0 && <div><SectionLabel>Reports</SectionLabel>{topicReports.map((item) => <Link href={item.href} key={item.href} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{item.label}</Link>)}</div>}
          {topicEntityLinks.length > 0 && <div><SectionLabel>Entities</SectionLabel>{topicEntityLinks.map((item) => <Link href={item.href} key={item.href} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{item.label}</Link>)}</div>}
          {sourcesForTopic.length > 0 && <div><SectionLabel>Cited sources</SectionLabel>{sourcesForTopic.map((item) => <Link href={item.href} key={item.href} className="block border-b border-foreground/15 py-3 text-sm hover:text-primary">{item.label}</Link>)}</div>}
        </aside></section>
      {topicEvents.length > 0 && <section className="py-12"><SectionLabel>Timeline</SectionLabel><div className="border-t border-foreground/15">{topicEvents.map((event) => <Link href={event.href} key={event.href} className="grid gap-2 border-b border-foreground/15 py-4 sm:grid-cols-[140px_1fr] hover:text-primary"><time dateTime={event.date} className="font-mono text-[10px] text-muted-foreground">{formatEditorialDate(event.date)}</time><span>{event.label}<ArrowUpRight size={14} className="ml-2 inline" /></span></Link>)}</div></section>}</> : <p className="border border-dashed border-foreground/20 p-7 text-sm text-muted-foreground">The topic record is missing from the newsroom snapshot.</p>}
    </main></Shell>;
}

export function AmpArticlePage() {
  const { slug = '' } = useParams();
  const snapshot = useNewsroomSnapshot();
  const story = snapshot.stories.find((candidate) => candidate.slug === slug);
  if (!story) {
    return <main className="mx-auto max-w-2xl px-5 py-10"><h1 className="font-serif text-4xl">AMP article not found</h1></main>;
  }
  return (
    <>
      <SeoHead article title={`${story.title} — Global AI News`} description={story.dek} path={`/article/${story.slug}`} />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <p className="eyebrow text-primary">Global AI News · AMP preview · {story.contentType ?? story.category}</p>
        <h1 className="mt-5 font-serif text-5xl leading-none">{story.title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{story.dek}</p>
        <EditorialImage alt={story.imageTreatment.alt} caption={story.imageTreatment.caption} />
        <p className="mt-8 text-lg leading-8"><StoryCitedText text={story.bottomLine} story={story} sources={snapshot.sources} /></p>
        <p className="mt-6 leading-8"><StoryCitedText text={story.whyItMatters} story={story} sources={snapshot.sources} /></p>
        <ul className="mt-6 grid gap-3 text-sm">{story.keyTakeaways.map((item) => <li key={item}><StoryCitedText text={item} story={story} sources={snapshot.sources} /></li>)}</ul>
        <div className="prose prose-lg mt-8 max-w-none"><StoryBody story={story} sources={snapshot.sources} /></div>
        <p className="mt-8 leading-8"><StoryCitedText text={story.whatChanges} story={story} sources={snapshot.sources} /></p>
        {story.sources.length > 0 && <StorySourceList story={story} sources={snapshot.sources} />}
        <Link href={`/article/${story.slug}`} className="mt-10 inline-block text-primary">Read the complete story →</Link>
      </main>
    </>
  );
}