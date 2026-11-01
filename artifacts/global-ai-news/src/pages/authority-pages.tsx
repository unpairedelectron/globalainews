import { ArrowUpRight, BookOpenText, Database, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@/components/canonical-link';
import { Footer, Header, SectionLabel, SeoHead } from '@/components/site';
import { useNewsroomSnapshot, usePublishedRegistryArticles } from '@/newsroom';
import { formatEditorialDate } from '@/editorial-date';
import { getStoryAuthorIdentity, uniqueStoriesByCanonicalSlug } from '@/content';
import { getResearchSeoTitle } from '@/seo-metadata';
import { useParams } from 'wouter';
import NotFound from '@/pages/not-found';

const container = 'editorial-page mx-auto max-w-[1440px] px-5 md:px-10';
const shell = ({ children }: { children: ReactNode }) => <><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground">Skip to main content</a><Header /><div id="main-content" tabIndex={-1} className="scroll-mt-20">{children}</div><Footer /></>;
const date = (value?: string | null) => value ? formatEditorialDate(value) : 'Date not stated';
function sourceSpecificUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return undefined;
    return parsed.pathname === '/' && !parsed.search && !parsed.hash ? undefined : url;
  } catch {
    return undefined;
  }
}

function TitleBlock({ eyebrow, title, dek }: { eyebrow: string; title: string; dek?: string }) {
  return <header className="border-b border-foreground/20 py-14 md:py-20">
    <p className="eyebrow text-primary">{eyebrow}</p>
    <h1 className="mt-6 max-w-5xl font-serif text-6xl leading-[.88] tracking-[-.035em] md:text-8xl">{title}</h1>
    {dek && <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">{dek}</p>}
  </header>;
}

function LinkList({ title, links }: { title: string; links: { href: string; label: string; detail?: string }[] }) {
  if (!links.length) return null;
  return <section className="mt-8">
    <SectionLabel>{title}</SectionLabel>
    <div className="border-t border-foreground/15">
      {links.map((item) => <Link key={`${item.href}-${item.label}`} href={item.href} className="group flex items-start justify-between gap-4 border-b border-foreground/15 py-4 hover:text-primary">
        <span><span className="block text-sm">{item.label}</span>{item.detail && <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.detail}</span>}</span>
        <ArrowUpRight aria-hidden="true" size={15} className="mt-1 shrink-0" />
      </Link>)}
    </div>
  </section>;
}

function entityHref(snapshot: ReturnType<typeof useNewsroomSnapshot>, slug: string) {
  const entity = snapshot.entities.find((item) => item.slug === slug);
  if (!entity) return undefined;
  const author = entity.kind === 'person' ? snapshot.authors.find((item) => item.slug === slug) : undefined;
  if (author && author.verifiedForPublication !== true) return undefined;
  const routeKinds = ['company', 'lab', 'model', 'person', 'technology', 'institution', 'policy', 'dataset', 'infrastructure'];
  return routeKinds.includes(entity.kind) ? { href: `/${entity.kind}/${slug}`, label: entity.name, detail: entity.strapline } : undefined;
}
function topicLinks(snapshot: ReturnType<typeof useNewsroomSnapshot>, slugs: string[]) {
  return slugs.flatMap((slug) => {
    const topic = snapshot.topics.find((item) => item.slug === slug);
    return topic ? [{ href: topic.route, label: topic.label, detail: topic.description }] : [];
  });
}
function storyLinks(snapshot: ReturnType<typeof useNewsroomSnapshot>, slugs: string[]) {
  return slugs.flatMap((slug) => {
    const story = snapshot.stories.find((item) => item.slug === slug);
    return story ? [{ href: `/article/${story.slug}`, label: story.title, detail: `${story.contentType ?? story.category} · ${date(story.date)}` }] : [];
  });
}
function timelineLinks(snapshot: ReturnType<typeof useNewsroomSnapshot>, slugs: string[]) {
  return slugs.flatMap((slug) => {
    const event = snapshot.timelineEvents.find((item) => item.slug === slug);
    return event ? [{ href: `/timeline/${slug}`, label: event.title, detail: `${date(event.date)} · ${event.description}` }] : [];
  });
}
function sourceLinks(snapshot: ReturnType<typeof useNewsroomSnapshot>, slugs: string[]) {
  return slugs.flatMap((slug) => {
    const source = snapshot.sources.find((item) => item.slug === slug);
    return source ? [{ href: `/source/${slug}`, label: source.name, detail: `${source.publisher}${source.publicationDate ? ` · ${date(source.publicationDate)}` : ''}` }] : [];
  });
}
function researchLinks(snapshot: ReturnType<typeof useNewsroomSnapshot>, slugs: string[]) {
  return slugs.flatMap((slug) => {
    const record = snapshot.researchRecords.find((item) => item.slug === slug && item.status === 'published');
    return record ? [{ href: `/research/${slug}`, label: record.title, detail: `Research record · updated ${date(record.updatedAt)}` }] : [];
  });
}
function productLinks(snapshot: ReturnType<typeof useNewsroomSnapshot>, slugs: string[]) {
  return slugs.flatMap((slug) => {
    const product = snapshot.dataProducts.find((item) => item.slug === slug && item.status === 'published');
    return product ? [{ href: `/data/${slug}`, label: product.title, detail: `Data product · updated ${date(product.updatedAt)}` }] : [];
  });
}

export function ResearchIndexPage() {
  const snapshot = useNewsroomSnapshot();
  const records = snapshot.researchRecords
    .filter((record) => record.status === 'published' && snapshot.stories.some((story) => story.slug === record.storySlug))
    .sort((a, b) => b.date.localeCompare(a.date));
  return <>{shell({ children: <><SeoHead title="Research — Global AI News" description="Published research records with methodology, findings, limitations and source trails." path="/research" />
    <main className={container}>
      <TitleBlock eyebrow="Global AI News · Research register" title="Research, made traceable." dek="Published research records show the question, method, evidence and limits behind our work. Follow the record into the reporting, data and sources." />
      <section className="grid gap-10 py-12 md:grid-cols-[.55fr_1.45fr] md:py-16">
        <aside><SectionLabel aside={`${records.length} published`}>The register</SectionLabel><p className="max-w-sm text-sm leading-7 text-muted-foreground">Research is presented as a documented record, not a detached conclusion. Status and dates travel with every entry.</p><div className="mt-8 border-l-2 border-primary/40 pl-4 text-xs leading-6 text-muted-foreground"><p className="eyebrow text-primary">Reading the record</p><p className="mt-2">Each entry distinguishes what the evidence supports from what remains unknown.</p></div></aside>
        <div aria-live="polite">{records.length ? records.map((record, index) => <article key={record.slug} data-testid={`card-research-${record.slug}`} className="grid grid-cols-[2.6rem_1fr] gap-4 border-t border-foreground/15 py-7 sm:grid-cols-[3.5rem_1fr]">
          <span className="font-serif text-3xl text-primary">{String(index + 1).padStart(2, '0')}</span>
          <div><p className="eyebrow text-primary">{record.provenance.replaceAll('-', ' ')} · published {date(record.date)}</p><Link href={`/research/${record.slug}`} className="mt-3 block max-w-3xl font-serif text-3xl leading-[.96] hover:text-primary sm:text-4xl">{record.title}</Link>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{record.researchQuestion}</p><p className="mt-4 text-xs text-muted-foreground">Updated {date(record.updatedAt)} · {record.findings.length} findings · {record.limitations.length} stated limitations</p>
          </div>
        </article>) : <div className="border border-dashed border-foreground/20 bg-surface-muted/50 p-8"><BookOpenText className="text-primary" size={22} /><h2 className="mt-5 font-serif text-3xl">No published research records yet.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">The index only includes records marked published in the newsroom snapshot.</p></div>}</div>
      </section>
    </main>
  </> })}</>;
}

export function DataIndexPage() {
  const snapshot = useNewsroomSnapshot();
  const products = snapshot.dataProducts
    .filter((product) => product.status === 'published' && product.storySlugs.some((slug) => snapshot.stories.some((story) => story.slug === slug)))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return <>{shell({ children: <><SeoHead title="Data products — Global AI News" description="Published datasets and dated observations with methods, limitations and source trails." path="/data" />
    <main className={container}>
      <TitleBlock eyebrow="Global AI News · Data register" title="Data you can trace." dek="Published data products show what is measured, how observations are grouped and which source records support them. Dated claims are not live inventories." />
      <section className="grid gap-10 py-12 md:grid-cols-[.55fr_1.45fr] md:py-16">
        <aside><SectionLabel aside={`${products.length} published`}>The register</SectionLabel><p className="max-w-sm text-sm leading-7 text-muted-foreground">Each product links back to its reporting and source records. Read the unit, methodology and limitations before comparing observations.</p></aside>
        <div>{products.length ? products.map((product) => {
          const linkedSources = product.sourceSlugs.filter((slug) => snapshot.sources.some((source) => source.slug === slug)).length;
          return <article key={product.slug} data-testid={`card-data-${product.slug}`} className="border-t border-foreground/15 py-7">
            <p className="eyebrow text-primary">Dataset · updated {date(product.updatedAt)}</p>
            <Link href={`/data/${product.slug}`} className="mt-3 block max-w-3xl font-serif text-3xl leading-[.96] hover:text-primary sm:text-4xl">{product.title}</Link>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{product.description}</p>
            <p className="mt-4 text-xs text-muted-foreground">{product.observations.length} dated observations · {linkedSources} linked source records · unit: {product.unit}</p>
          </article>;
        }) : <div className="border border-dashed border-foreground/20 bg-surface-muted/50 p-8"><Database className="text-primary" size={22} /><h2 className="mt-5 font-serif text-3xl">No published data products yet.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">This index includes products marked published and linked to a published story in the current newsroom snapshot.</p></div>}</div>
      </section>
    </main>
  </> })}</>;
}

export function ResearchRecordPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const snapshot = useNewsroomSnapshot();
  const record = snapshot.researchRecords.find((item) =>
    item.slug === slug &&
    item.status === 'published' &&
    snapshot.stories.some((story) => story.slug === item.storySlug),
  );
  if (!record) return <NotFound />;
  const stories = [...new Set([record.storySlug, ...record.relatedStorySlugs])];
  const linkedStory = snapshot.stories.find((story) => story.slug === record.storySlug);
  const author = linkedStory ? getStoryAuthorIdentity(linkedStory, snapshot.authors) : { type: 'Organization' as const, name: 'Global AI News Editorial Desk' };
  return <>{shell({ children: <><SeoHead title={getResearchSeoTitle(record.title)} description={record.researchQuestion} path={`/research/${record.slug}`} />
    <main className={`${container} max-w-[1240px]`}><nav aria-label="Breadcrumb" className="pt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><Link href="/research" className="hover:text-primary">Research</Link><span className="mx-2">/</span><span aria-current="page">{record.slug}</span></nav>
      <TitleBlock eyebrow={`Research record · ${record.provenance.replaceAll('-', ' ')} · ${record.status}`} title={record.title} dek={record.researchQuestion} />
      <div className="grid gap-12 py-12 md:grid-cols-[minmax(0,1fr)_340px]">
        <article className="space-y-10">
          <section className="grid gap-5 border-b border-foreground/15 pb-7 sm:grid-cols-3"><div><p className="eyebrow text-muted-foreground">Published</p><p className="mt-2 text-sm">{date(record.date)}</p></div><div><p className="eyebrow text-muted-foreground">Last reviewed</p><p className="mt-2 text-sm">{date(record.updatedAt)}</p></div><div><p className="eyebrow text-muted-foreground">Author</p><p className="mt-2 text-sm">{author.name}{author.description && <span className="mt-1 block text-xs leading-5 text-muted-foreground">{author.description}</span>}</p></div></section>
          <section><SectionLabel>Findings</SectionLabel><ol className="grid gap-0">{record.findings.map((finding, index) => <li key={finding} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-foreground/10 py-5"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')}</span><p className="max-w-3xl text-base leading-7">{finding}</p></li>)}</ol></section>
          <section className="grid gap-8 border-y border-foreground/15 py-7 sm:grid-cols-2"><div><SectionLabel>Methodology</SectionLabel><p className="text-sm leading-7 text-muted-foreground">{record.methodology}</p></div><div><SectionLabel>Dataset description</SectionLabel><p className="text-sm leading-7 text-muted-foreground">{record.datasetDescription}</p></div></section>
          <section><SectionLabel>Limitations</SectionLabel><ul className="grid gap-3">{record.limitations.map((limitation) => <li key={limitation} className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">{limitation}</li>)}</ul></section>
          <section><SectionLabel>Update history</SectionLabel>{record.updateHistory.length ? record.updateHistory.map((update) => <div key={`${update.date}-${update.summary}`} className="grid gap-2 border-t border-foreground/15 py-4 sm:grid-cols-[120px_1fr]"><time dateTime={update.date} className="font-mono text-[10px] text-primary">{date(update.date)}</time><p className="text-sm leading-6">{update.summary}</p></div>) : <p className="text-sm text-muted-foreground">No update history is recorded.</p>}</section>
        </article>
        <aside className="space-y-8 md:border-l md:border-foreground/15 md:pl-8">
          <LinkList title="Reporting & related stories" links={storyLinks(snapshot, stories)} />
          <LinkList title="Topics" links={topicLinks(snapshot, record.topicSlugs)} />
          <LinkList title="Entities" links={record.entitySlugs.flatMap((slug) => { const item = entityHref(snapshot, slug); return item ? [item] : []; })} />
          <LinkList title="Data products" links={productLinks(snapshot, record.dataProductSlugs)} />
          <LinkList title="Timeline" links={timelineLinks(snapshot, record.timelineSlugs)} />
          <LinkList title="Sources" links={sourceLinks(snapshot, record.sourceSlugs)} />
        </aside>
      </div>
    </main>
  </> })}</>;
}

function ObservationStatus({ label, value }: { label: string; value: string }) {
  return <div className="border-t border-foreground/10 pt-3"><p className="eyebrow text-muted-foreground">{label}</p><p className="mt-2 text-sm capitalize">{value.replaceAll('-', ' ')}</p></div>;
}
function ObservationMetadata({ label, value }: { label: string; value: string }) {
  return <div className="border-t border-foreground/10 pt-3"><dt className="eyebrow text-muted-foreground">{label}</dt><dd className="mt-2 text-sm leading-6">{value}</dd></div>;
}

export function DataProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const snapshot = useNewsroomSnapshot();
  const product = snapshot.dataProducts.find((item) =>
    item.slug === slug &&
    item.status === 'published' &&
    item.storySlugs.some((storySlug) => snapshot.stories.some((story) => story.slug === storySlug)),
  );
  if (!product) return <NotFound />;
  return <>{shell({ children: <><SeoHead title={`${product.title} — Global AI News Data`} description={product.description} path={`/data/${product.slug}`} />
    <main className={`${container} max-w-[1320px]`}><nav aria-label="Breadcrumb" className="pt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><Link href="/data" className="hover:text-primary">Data</Link><span className="mx-2">/</span><span aria-current="page">Data product</span></nav>
      <TitleBlock eyebrow={`Data product · ${product.evidenceType.replaceAll('-', ' ')}`} title={product.title} dek={product.description} />
      <section className="grid gap-6 border-b border-foreground/15 py-7 sm:grid-cols-3"><div><p className="eyebrow text-muted-foreground">Last updated</p><p className="mt-2 text-sm">{date(product.updatedAt)}</p></div><div><p className="eyebrow text-muted-foreground">Observation unit</p><p className="mt-2 text-sm">{product.unit}</p></div><div><p className="eyebrow text-muted-foreground">Evidence framing</p><p className="mt-2 text-sm">Dated public-source claims</p></div></section>
      <section className="py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><SectionLabel aside={`${product.observations.length} observations`}>Recorded observations</SectionLabel><p className="max-w-2xl text-sm leading-6 text-muted-foreground">These are dated claims, not a live inventory. Stages are kept distinct; announcement does not establish installation, deployment, access or scheduling.</p></div><Database className="mb-1 text-primary" size={24} strokeWidth={1.4} /></div>
        {product.observations.length ? <div className="mt-6 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-2">
          {product.observations.map((item) => <article key={item.id} data-testid={`observation-${item.id}`} className="bg-background p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-foreground/15 pb-5"><div><p className="eyebrow text-primary">{item.stageLabel}</p><h2 className="mt-3 font-serif text-4xl leading-none">{item.quantityLabel}</h2></div><span className="border border-foreground/15 px-2 py-1 font-mono text-[10px] uppercase tracking-widest">{item.qualifier}</span></div>
            <p className="mt-4 text-sm">{[item.organization, item.facility, item.location, item.geography].filter(Boolean).join(' · ')}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.acceleratorType}{item.providerCount !== undefined ? ` · ${item.providerCount} providers` : ''}</p>
            <dl className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <ObservationMetadata label="Source/report date" value={item.reportedOn ? date(item.reportedOn) : 'Not stated by source'} />
              <ObservationMetadata label="Source-stated snapshot date" value={item.asOf ? item.asOf === '2026-06' ? 'June 2026' : date(item.asOf) : 'Not stated by source'} />
              {item.documentCreatedOn && <ObservationMetadata label="Document metadata date (not snapshot date)" value={date(item.documentCreatedOn)} />}
              <ObservationMetadata label="Count unit" value={item.unit} />
              <ObservationMetadata label="Denominator / count basis" value={item.denominator} />
              <ObservationMetadata label="Source definition" value={item.definition} />
            </dl>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4"><ObservationStatus label="Installed" value={item.installed} /><ObservationStatus label="Deployed" value={item.deployed} /><ObservationStatus label="Accessible" value={item.accessible} /><ObservationStatus label="Schedulable" value={item.schedulable} /></div>
            <div className="mt-6 border-l-2 border-accent pl-4"><p className="eyebrow text-muted-foreground">Scope limitation</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.limitation}</p></div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{item.sourceKind} source</p>
            <Link href={`/source/${item.sourceSlug}`} className="mt-4 inline-flex items-center gap-2 border-b border-primary/40 pb-1 text-xs text-primary">Open citation record <ArrowUpRight size={13} /></Link>
          </article>)}
        </div> : <div className="mt-5 border border-dashed border-foreground/20 p-7 text-sm text-muted-foreground">No observations are recorded in this published product.</div>}
      </section>
      <div className="grid gap-10 border-t border-foreground/15 py-10 md:grid-cols-[1fr_1fr]"><div><SectionLabel>Methodology</SectionLabel><p className="text-sm leading-7 text-muted-foreground">{product.methodology}</p><div className="mt-8"><SectionLabel>Limitations</SectionLabel><ul className="grid gap-3">{product.limitations.map((limitation) => <li key={limitation} className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">{limitation}</li>)}</ul></div></div><aside className="space-y-7"><LinkList title="Research records" links={researchLinks(snapshot, product.researchSlugs)} /><LinkList title="Reporting" links={storyLinks(snapshot, product.storySlugs)} /><LinkList title="Topics" links={topicLinks(snapshot, product.topicSlugs)} /><LinkList title="Entities" links={product.entitySlugs.flatMap((entitySlug) => { const item = entityHref(snapshot, entitySlug); return item ? [item] : []; })} /><LinkList title="Timeline" links={timelineLinks(snapshot, product.timelineSlugs)} /><LinkList title="Sources" links={sourceLinks(snapshot, product.sourceSlugs)} /></aside></div>
      <section className="border-t border-foreground/15 py-8"><SectionLabel>Update history</SectionLabel>{product.updateHistory.map((entry) => <p key={`${entry.date}-${entry.summary}`} className="border-t border-foreground/10 py-4 text-sm leading-6"><time dateTime={entry.date} className="mr-4 font-mono text-[10px] text-primary">{date(entry.date)}</time>{entry.summary}</p>)}</section>
    </main>
  </> })}</>;
}

export function SourceRecordPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const snapshot = useNewsroomSnapshot();
  const source = snapshot.sources.find((item) => item.slug === slug);
  if (!source) return <NotFound />;
  const citingStories = snapshot.stories.filter((story) => story.sources.includes(slug));
  const research = snapshot.researchRecords.filter((record) => record.status === 'published' && record.sourceSlugs.includes(slug));
  const products = snapshot.dataProducts.filter((record) => record.status === 'published' && record.sourceSlugs.includes(slug));
  const timelines = snapshot.timelineEvents.filter((event) => event.sourceSlugs?.includes(slug));
  return <>{shell({ children: <><SeoHead title={`${source.name} — Source record | Global AI News`} description={source.relevance ?? source.scopeNote ?? `Citation details for ${source.name}.`} path={`/source/${source.slug}`} indexable={false} />
    <main className={`${container} max-w-[1180px]`}><nav aria-label="Breadcrumb" className="pt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><Link href="/research" className="hover:text-primary">Research</Link><span className="mx-2">/</span><span aria-current="page">Source record</span></nav>
      <TitleBlock eyebrow="Citation record · not an endorsement" title={source.name} dek={source.title ?? source.relevance ?? source.scopeNote} />
      <section className="grid gap-10 py-10 md:grid-cols-[1fr_320px]"><article><SectionLabel>Source details</SectionLabel><dl className="grid gap-0 sm:grid-cols-2">{([
        ['Publisher', source.publisher], ['Source kind', source.kind], ['Source type', source.sourceType?.replaceAll('-', ' ')], ['Classification', source.classification], ['Evidence captured', source.evidenceType?.replaceAll('-', ' ')], ['Tier', source.tier ? `Tier ${source.tier}` : undefined], ['Published', date(source.publicationDate)], ['Accessed', date(source.accessed)],
      ] as [string, string | undefined][]).filter(([, value]) => value).map(([label, value]) => <div key={label} className="border-t border-foreground/15 py-4"><dt className="eyebrow text-muted-foreground">{label}</dt><dd className="mt-2 text-sm capitalize">{value}</dd></div>)}</dl>
        {source.scopeNote && <div className="mt-7 border-l-2 border-accent pl-5"><p className="eyebrow text-muted-foreground">Scope note</p><p className="mt-2 text-sm leading-7">{source.scopeNote}</p></div>}
        {source.notes?.length ? <div className="mt-8"><SectionLabel>Editorial notes</SectionLabel><ul className="grid gap-3">{source.notes.map((note) => <li key={note} className="text-sm leading-6 text-muted-foreground">{note}</li>)}</ul></div> : null}
        {sourceSpecificUrl(source.url) ? <a href={sourceSpecificUrl(source.url)} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-11 items-center gap-2 border border-primary px-4 text-sm text-primary hover:bg-primary hover:text-primary-foreground">Visit cited source <ArrowUpRight size={15} /></a> : <p role="note" className="mt-8 border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">This source record does not contain a usable source-specific web address. Treat the citation as incomplete until the record is corrected.</p>}
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={14} />This citation record is useful for readers, but is not indexed as a standalone landing page.</p>
      </article><aside className="space-y-8">
        <LinkList title="Cited by reporting" links={storyLinks(snapshot, citingStories.map((story) => story.slug))} />
        <LinkList title="Research records" links={researchLinks(snapshot, research.map((record) => record.slug))} />
        <LinkList title="Data products" links={productLinks(snapshot, products.map((record) => record.slug))} />
        <LinkList title="Timeline" links={timelineLinks(snapshot, timelines.map((event) => event.slug))} />
        <LinkList title="Topics" links={topicLinks(snapshot, [...new Set([...research.flatMap((r) => r.topicSlugs), ...products.flatMap((p) => p.topicSlugs), ...timelines.flatMap((e) => e.topicSlugs ?? [])])])} />
      </aside></section>
    </main>
  </> })}</>;
}

export function TopicsIndexPage() {
  const snapshot = useNewsroomSnapshot();
  const publishedRegistryArticles = usePublishedRegistryArticles();
  const topics = snapshot.topics
    .filter((topic) => topic.indexable)
    .map((topic) => ({
      topic,
      registryArticles: publishedRegistryArticles.filter((article) =>
        topic.slug === 'india' ? /india/i.test(article.topic) : topic.slug === 'ai' && !/india/i.test(article.topic),
      ),
      stories: uniqueStoriesByCanonicalSlug(topic.storySlugs.flatMap((slug) => {
        const story = snapshot.stories.find((item) => item.slug === slug);
        return story ? [story] : [];
      })),
    }))
    .filter(({ stories, registryArticles }) => stories.length > 0 || registryArticles.length > 0)
    .sort((left, right) => right.stories.length + right.registryArticles.length - left.stories.length - left.registryArticles.length || left.topic.label.localeCompare(right.topic.label));
  const registryTopicGroups = [
    { slug: 'ai', label: 'AI', route: '/topic/ai', articles: publishedRegistryArticles.filter((article) => !/india/i.test(article.topic)) },
    { slug: 'india', label: 'India', route: '/topic/india', articles: publishedRegistryArticles.filter((article) => /india/i.test(article.topic)) },
  ].filter((group) => group.articles.length > 0);

  return <>{shell({ children: <>
    <SeoHead
      title="Topics — Global AI News"
      description="Explore connected topic records linking published reporting, research, data, sources and timelines."
      path="/topics"
    />
    <main className={container}>
      <TitleBlock
        eyebrow="Global AI News · Topic index"
        title="Topics that connect the record."
        dek="Each topic groups published reporting with the research, entities, sources and events that explain what changed."
      />
      <section data-testid="topics-index" className="grid gap-px border-x border-b border-foreground/15 bg-foreground/15 md:grid-cols-2">
        {topics.length ? topics.map(({ topic, stories, registryArticles }, index) => {
          const reports = topic.reportSlugs.flatMap((slug) => {
            const story = snapshot.stories.find((item) => item.slug === slug && item.contentType === 'Report');
            return story ? [story] : [];
          });
          return <article key={topic.slug} data-testid={`topic-card-${topic.slug}`} className="bg-background p-6 md:p-8">
            <div className="flex items-start justify-between gap-5">
              <p className="eyebrow text-primary">Connected topic · {String(index + 1).padStart(2, '0')}</p>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{stories.length + registryArticles.length} {stories.length + registryArticles.length === 1 ? 'story' : 'stories'}</span>
            </div>
            <Link href={topic.route} className="mt-5 block font-serif text-4xl leading-none hover:text-primary">{topic.label}<ArrowUpRight aria-hidden="true" size={18} className="ml-2 inline" /></Link>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{topic.description}</p>
            {topic.importantDevelopments.length > 0 && <div className="mt-6 border-t border-foreground/15 pt-5">
              <p className="eyebrow text-muted-foreground">Recent developments</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6">{topic.importantDevelopments.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-foreground/15 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>{topic.entitySlugs.length} entities</span>
              <span>{topic.researchSlugs.length} research records</span>
              <span>{topic.dataProductSlugs.length} data products</span>
              <span>{topic.timelineSlugs.length} timeline events</span>
              {reports.length > 0 && <span>{reports.length} reports</span>}
            </div>
            {reports.length > 0 && <div className="mt-5">
              <p className="eyebrow text-primary">Featured report</p>
              {reports.map((report) => <Link key={report.slug} href={`/article/${report.slug}`} className="mt-2 block text-sm hover:text-primary">{report.title}<ArrowUpRight aria-hidden="true" size={13} className="ml-1 inline" /></Link>)}
            </div>}
            {registryArticles.length > 0 && <div className="mt-5 border-t border-foreground/10 pt-4">
              <p className="eyebrow text-primary">Published release articles</p>
              {registryArticles.map((article) => <Link key={article.slug} href={`/article/${article.slug}`} className="mt-2 block text-sm hover:text-primary">{article.title}<ArrowUpRight aria-hidden="true" size={13} className="ml-1 inline" /></Link>)}
            </div>}
          </article>;
        }) : <div data-testid="topics-index-empty" className="bg-background p-8 md:col-span-2">
          <p className="eyebrow text-primary">No indexable topic records</p>
          <h2 className="mt-4 font-serif text-3xl">Topics appear when the newsroom has connected reporting.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Unpublished and empty topic records are kept out of this public index.</p>
        </div>}
      </section>
      {registryTopicGroups.length > 0 && <section data-testid="registry-topic-groups" className="grid gap-8 border-b border-foreground/15 py-8 md:grid-cols-2">
        {registryTopicGroups.map((group) => <div key={group.slug} className="border-t border-foreground/15 pt-5">
          <Link href={group.route} className="font-serif text-3xl hover:text-primary">{group.label} release topic</Link>
          <div className="mt-3">{group.articles.map((article) => <Link key={article.slug} href={`/article/${article.slug}`} className="block border-t border-foreground/10 py-3 text-sm hover:text-primary">{article.title}</Link>)}</div>
        </div>)}
      </section>}
      <p className="max-w-2xl py-8 text-xs leading-5 text-muted-foreground">Only topics with published reporting are listed. Counts reflect the current newsroom snapshot; they are not estimates of the wider field.</p>
    </main>
  </> })}</>;
}