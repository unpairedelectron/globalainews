import { ArrowUpRight, BookOpenCheck } from 'lucide-react';
import { Link } from '@/components/canonical-link';
import { Footer, Header, SectionLabel, SeoHead } from '@/components/site';
import { useNewsroomSnapshot } from '@/newsroom';
import { formatEditorialDate } from '@/editorial-date';

const container = 'editorial-page mx-auto max-w-[1440px] px-5 md:px-10';

export function ReportsIndexPage() {
  const snapshot = useNewsroomSnapshot();
  const reports = snapshot.stories
    .filter((story) => story.contentType === 'Report')
    .sort((a, b) => b.date.localeCompare(a.date));

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
          <div className="relative overflow-hidden border border-foreground/15 bg-surface-muted p-5 md:p-7">
            <div aria-hidden="true" className="absolute inset-5 border border-primary/15" />
            <div aria-hidden="true" className="absolute left-[18%] top-[46%] h-px w-[62%] rotate-[-13deg] bg-primary/45" />
            <div aria-hidden="true" className="absolute left-[23%] top-[56%] h-px w-[54%] rotate-[13deg] bg-primary/35" />
            <div aria-hidden="true" className="absolute left-[19%] top-[45%] h-2 w-2 rounded-full bg-primary" />
            <div aria-hidden="true" className="absolute left-[49%] top-[37%] h-2 w-2 rounded-full bg-accent" />
            <div aria-hidden="true" className="absolute right-[18%] top-[59%] h-2 w-2 rounded-full bg-primary" />
            <div className="relative flex min-h-36 flex-col justify-between">
              <span className="eyebrow text-primary">Evidence / sources / context</span>
              <p className="max-w-xs font-serif text-3xl leading-[.95]">
                Follow the connections, not just the claim.
              </p>
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
                  const author = snapshot.authors.find((candidate) => candidate.slug === story.author);
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
                            <span className="eyebrow text-primary">Maintained report</span>
                            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                            <span className="text-xs text-muted-foreground">{story.category}</span>
                            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground/30" />
                            <span className="text-xs text-muted-foreground">{story.readTime}</span>
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
                            {author ? `By ${author.name}` : 'Byline unavailable'} ·{' '}
                            <time dateTime={story.date}>{formatEditorialDate(story.date)}</time>
                          </p>
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
      </main>
      <Footer />
    </>
  );
}