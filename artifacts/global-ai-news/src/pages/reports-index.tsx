import { ArrowUpRight, BookOpenCheck } from 'lucide-react';
import { Link } from '@/components/canonical-link';
import { Footer, Header, SectionLabel, SeoHead } from '@/components/site';
import { useNewsroomSnapshot } from '@/newsroom';
import { formatEditorialDate } from '@/editorial-date';
import { getStoryAuthorIdentity, getStoryReadTime } from '@/content';

const container = 'editorial-page mx-auto max-w-[1440px] px-5 md:px-10';

export function ReportsIndexPage() {
  const snapshot = useNewsroomSnapshot();
  const reports = snapshot.stories
    .filter((story) => story.contentType === 'Report')
    .sort((a, b) => b.date.localeCompare(a.date));
  const featuredReport = reports[0];
  const researchRecords = snapshot.researchRecords
    .filter((record) => record.status === 'published' && snapshot.stories.some((story) => story.slug === record.storySlug))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  const dataProducts = snapshot.dataProducts
    .filter((product) => product.status === 'published' && product.storySlugs.some((slug) => snapshot.stories.some((story) => story.slug === slug)))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  const indexableTopics = snapshot.topics.filter((topic) => topic.indexable);
  const reportEntityKinds = ['company', 'lab', 'model', 'person', 'technology', 'institution', 'policy', 'dataset', 'infrastructure'];

  return (
    <>
      <Header />
      <SeoHead
        title="Reports — Global AI News"
        description="Maintained reports on the AI industry, built from evidence, source trails and connected context."
        path="/reports"
      />
      <main className={container}>
        <section className="grid gap-9 border-b border-foreground/20 py-14 md:grid-cols-[1.2fr_.8fr] md:items-end md:py-20">
          <div>
            <p className="eyebrow text-primary">Global AI News · Report desk</p>
            <h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] tracking-[-.04em] md:text-[9rem]">
              Reports<span className="text-primary">.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-7 text-muted-foreground">
              Maintained reporting that follows the evidence beyond the headline — and maps what each finding changes across the AI industry.
            </p>
          </div>
          <div className="border border-foreground/15 bg-surface-muted p-5 md:p-7">
            <div className="flex min-h-36 flex-col justify-between">
              <span className="eyebrow text-primary">How to use this library</span>
              {featuredReport ? <div>
                <p className="eyebrow text-muted-foreground">Latest maintained report</p>
                <Link href={`/article/${featuredReport.slug}`} className="mt-3 block max-w-sm font-serif text-3xl leading-[.95] hover:text-primary">{featuredReport.title}<ArrowUpRight aria-hidden="true" size={17} className="ml-2 inline" /></Link>
                <p className="mt-4 text-xs leading-5 text-muted-foreground">Published {formatEditorialDate(featuredReport.date)} · updated {formatEditorialDate(featuredReport.dateModified ?? featuredReport.date)} · {featuredReport.sources.length} cited source records</p>
              </div> : <p className="max-w-xs font-serif text-3xl leading-[.95]">Follow the connections, not just the claim.</p>}
            </div>
          </div>
        </section>

        <section className="grid gap-10 py-10 md:grid-cols-[.55fr_1.45fr] md:py-14">
          <aside>
            <SectionLabel aside={`${reports.length} ${reports.length === 1 ? 'report' : 'reports'}`}>The report index</SectionLabel>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Each report is part of a living record: reporting connected to the sources, people and events behind it.
            </p>
            <div className="mt-8 hidden border-l border-primary/30 pl-4 text-xs leading-5 text-muted-foreground md:block">
              <p className="eyebrow text-primary">Our approach</p>
              <p className="mt-3">No detached conclusions. Every story sits inside its evidence trail.</p>
            </div>
          </aside>

          <div aria-live="polite">
            {reports.length ? (
              <div className="border-t border-foreground/15">
                {reports.map((story, index) => {
                  const author = getStoryAuthorIdentity(story, snapshot.authors);
                  const storyResearch = researchRecords.filter((record) => record.storySlug === story.slug || record.relatedStorySlugs.includes(story.slug));
                  const storyData = dataProducts.filter((product) => product.storySlugs.includes(story.slug));
                  const storyTopics = snapshot.topics.filter((topic) => topic.indexable && topic.storySlugs.includes(story.slug));
                  const storyEntities = story.entities.flatMap((slug) => {
                    const entity = snapshot.entities.find((candidate) => candidate.slug === slug);
                    const author = entity?.kind === 'person' ? snapshot.authors.find((candidate) => candidate.slug === slug) : undefined;
                    return entity && reportEntityKinds.includes(entity.kind) && (!author || author.verifiedForPublication === true) ? [entity] : [];
                  });
                  return (
                    <article
                      key={story.slug}
                      data-testid={`card-report-${story.slug}`}
                      className="group border-b border-foreground/15 py-6 transition-colors hover:bg-primary/[.035] md:py-8"
                    >
                      <div className="grid grid-cols-[2.5rem_1fr] gap-4 sm:grid-cols-[3.25rem_1fr_auto] sm:gap-6">
                        <span aria-hidden="true" className="pt-1 font-serif text-3xl leading-none text-primary/65">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="eyebrow text-primary">Report · published</span>
                            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                            <span className="text-xs text-muted-foreground">{story.category}</span>
                            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground/30" />
                            <span className="text-xs text-muted-foreground">{getStoryReadTime(story)}</span>
                          </div>
                          <Link
                            data-testid={`link-report-${story.slug}`}
                            href={`/article/${story.slug}`}
                            className="mt-3 block max-w-3xl font-serif text-3xl leading-[.96] transition-colors group-hover:text-primary sm:text-4xl"
                          >
                            {story.title}
                          </Link>
                          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{story.dek}</p>
                          <p className="mt-5 text-xs text-muted-foreground">
                            {author ? `By ${author.name}` : 'Byline unavailable'} · Published{' '}
                            <time dateTime={story.date}>{formatEditorialDate(story.date)}</time>
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">Updated <time dateTime={story.dateModified ?? story.date}>{formatEditorialDate(story.dateModified ?? story.date)}</time> · Source coverage: {story.sources.length} cited records</p>
                          <div className="mt-5 grid gap-3 border-t border-foreground/10 pt-4 sm:grid-cols-2">
                            <div><p className="eyebrow text-muted-foreground">Scope</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{story.dek}</p></div>
                            {storyResearch.length > 0 && <div><p className="eyebrow text-muted-foreground">Research method</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{storyResearch[0].methodology}</p></div>}
                          </div>
                          {(storyResearch.length > 0 || storyData.length > 0 || storyTopics.length > 0 || storyEntities.length > 0) && <div data-testid={`report-network-${story.slug}`} className="mt-6 grid gap-x-6 gap-y-5 border-t border-foreground/15 pt-5 sm:grid-cols-2">
                            {storyResearch.length > 0 && <div><p className="eyebrow text-primary">Research</p>{storyResearch.map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="mt-2 block text-sm hover:text-primary">{record.title}<span className="mt-1 block text-xs text-muted-foreground">Updated {formatEditorialDate(record.updatedAt)}</span></Link>)}</div>}
                            {storyData.length > 0 && <div><p className="eyebrow text-primary">Data products</p>{storyData.map((product) => <Link key={product.slug} href={`/data/${product.slug}`} className="mt-2 block text-sm hover:text-primary">{product.title}<span className="mt-1 block text-xs text-muted-foreground">Updated {formatEditorialDate(product.updatedAt)}</span></Link>)}</div>}
                            {storyTopics.length > 0 && <div><p className="eyebrow text-primary">Topics</p>{storyTopics.map((topic) => <Link key={topic.slug} href={topic.route} className="mt-2 block text-sm hover:text-primary">{topic.label}</Link>)}</div>}
                            {storyEntities.length > 0 && <div><p className="eyebrow text-primary">Entities</p>{storyEntities.map((entity) => <Link key={entity.slug} href={`/${entity.kind}/${entity.slug}`} className="mt-2 block text-sm hover:text-primary">{entity.name}</Link>)}</div>}
                          </div>}
                        </div>
                        <span aria-hidden="true" className="hidden self-start pt-2 text-primary sm:block">
                          <ArrowUpRight size={17} strokeWidth={1.5} />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div
                data-testid="status-reports-empty"
                className="relative overflow-hidden border border-foreground/15 bg-surface-muted px-6 py-10 sm:px-9 sm:py-12"
              >
                <div aria-hidden="true" className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-primary/20 sm:block" />
                <div aria-hidden="true" className="absolute right-14 top-14 hidden h-12 w-12 rounded-full border border-accent/60 sm:block" />
                <BookOpenCheck aria-hidden="true" className="text-primary" size={22} strokeWidth={1.5} />
                <p className="eyebrow mt-6 text-primary">The record is taking shape</p>
                <h2 className="mt-3 max-w-xl font-serif text-4xl leading-[.95] sm:text-5xl">
                  No reports are published yet.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                  When a maintained report is published, it will appear here with its reporting, sources and connected context.
                </p>
              </div>
            )}
          </div>
        </section>
        <section data-testid="reports-research-data" className="grid gap-10 border-t border-foreground/15 py-12 md:grid-cols-2">
          <div><SectionLabel aside={`${researchRecords.length} published`}>Research register</SectionLabel>
            {researchRecords.length ? <div className="border-t border-foreground/15">{researchRecords.map((record) => <Link key={record.slug} href={`/research/${record.slug}`} className="block border-b border-foreground/15 py-4 hover:text-primary"><span className="eyebrow text-primary">Research · {record.status} · {record.provenance.replaceAll('-', ' ')}</span><span className="mt-2 block font-serif text-xl">{record.title}</span><span className="mt-2 block text-xs leading-5 text-muted-foreground">Scope: {record.researchQuestion}</span><span className="mt-2 block text-xs leading-5 text-muted-foreground">Method: {record.methodology}</span><span className="mt-2 block text-xs text-muted-foreground">{record.sourceSlugs.length} source records · Published {formatEditorialDate(record.date)} · Updated {formatEditorialDate(record.updatedAt)}</span></Link>)}</div> : <p className="border-t border-foreground/15 py-4 text-sm text-muted-foreground">No published research records are connected yet.</p>}
          </div>
          <div><SectionLabel aside={`${dataProducts.length} published`}>Data products</SectionLabel>
            {dataProducts.length ? <div className="border-t border-foreground/15">{dataProducts.map((product) => <Link key={product.slug} href={`/data/${product.slug}`} className="block border-b border-foreground/15 py-4 hover:text-primary"><span className="eyebrow text-primary">Data product · {product.status}</span><span className="mt-2 block font-serif text-xl">{product.title}</span><span className="mt-2 block text-xs leading-5 text-muted-foreground">Scope: {product.description}</span><span className="mt-2 block text-xs leading-5 text-muted-foreground">Method: {product.methodology}</span><span className="mt-2 block text-xs text-muted-foreground">{product.sourceSlugs.length} source records · {product.observations.length} dated observations · Updated {formatEditorialDate(product.updatedAt)}</span></Link>)}</div> : <p className="border-t border-foreground/15 py-4 text-sm text-muted-foreground">No published data products are connected yet.</p>}
          </div>
        </section>
        <section data-testid="reports-topic-index" className="grid gap-10 border-t border-foreground/15 py-12 md:grid-cols-2">
          <div><SectionLabel>Topics</SectionLabel><div className="border-t border-foreground/15">{indexableTopics.map((topic) => <Link key={topic.slug} href={topic.route} className="block border-b border-foreground/15 py-4 hover:text-primary"><span className="block text-sm">{topic.label}</span><span className="mt-1 block text-xs text-muted-foreground">{topic.description}</span></Link>)}</div></div>
          <div><SectionLabel>Explore the record</SectionLabel><p className="max-w-lg text-sm leading-6 text-muted-foreground">Follow each report into its topic hubs, cited sources, research methods, dated data and related entities.</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3"><Link href="/topics" className="border-b border-primary/50 pb-1 text-sm text-primary">Browse topics</Link><Link href="/research" className="border-b border-primary/50 pb-1 text-sm text-primary">Browse research</Link></div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}