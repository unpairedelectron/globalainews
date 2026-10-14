import React from 'react';
import {
  findStory,
  getStoryAuthorIdentity,
  getStoryReadTime,
  getPublicDateModified,
  getReaderFacingContentType,
  type NewsroomContentSnapshot,
  type Story,
} from './content';
import { formatEditorialDate, getLatestStory } from './editorial-date';
import type { SeoMetadata } from './seo-metadata';
import { getEditorialPageCopy } from './editorial-pages';
import { getEditorialImagePath } from './editorial-images';
import { StoryBody, StoryCitedText, StorySourceList } from './components/story-content';
import { AuthorDirectory } from './components/author-directory';
import { AdSlot } from './components/monetization';
import {
  ComparisonReportContent,
  type ComparisonReportSlug,
} from './components/comparison-reports';
import { GlucoSmartPrivacyContent } from './components/glucosmart-privacy-content';

interface SeoPrerenderProps {
  route: string;
  metadata: SeoMetadata;
  snapshot: NewsroomContentSnapshot;
}

function articleImagePath(slug: string): string {
  return `/social/articles/${slug}.png`;
}

function StoryList({
  stories,
  authors,
  idPrefix,
}: Pick<NewsroomContentSnapshot, 'stories' | 'authors'> & { idPrefix?: string }) {
  return (
    <div className="grid gap-8">
      {stories.map((story, index) => (
        <article id={idPrefix ? `${idPrefix}-${index}` : undefined} key={story.slug} className="grid gap-5 border-b border-foreground/15 pb-8 sm:grid-cols-[220px_1fr]">
          <a href={`/article/${story.slug}/`} aria-label={story.title} className="block overflow-hidden border border-foreground/15 bg-surface-muted">
            <img
              src={articleImagePath(story.slug)}
              alt={story.imageTreatment.alt}
              width={1200}
              height={630}
              loading="lazy"
              className="aspect-[1.91/1] h-full w-full object-cover"
            />
          </a>
          <div>
            <p className="eyebrow text-primary">{story.category} · {getStoryReadTime(story)}</p>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl leading-[.95]">
              <a href={`/article/${story.slug}/`} className="hover:text-primary">{story.title}</a>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{story.dek}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <time dateTime={story.date}>{formatEditorialDate(story.date)}</time>
              {' · '}
              {(() => {
                const author = getStoryAuthorIdentity(story, authors);
                return author
                  ? author.type === 'Person' && author.slug
                    ? <a href={`/person/${author.slug}/`} className="hover:text-primary">{author.name}</a>
                    : <span>{author.name}</span>
                  : 'Byline unavailable';
              })()}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function AuthorityLinkList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; detail?: string }[];
}) {
  if (!links.length) return null;
  return (
    <section className="my-8">
      <h2 className="eyebrow mb-3 border-b border-foreground/15 pb-3 text-primary">{title}</h2>
      <ul className="grid gap-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`} className="border-b border-foreground/10 pb-3">
            <a href={link.href} className="text-sm hover:text-primary">{link.label}</a>
            {link.detail && <p className="mt-1 text-xs leading-5 text-muted-foreground">{link.detail}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function entityRoute(kind: string, slug: string): string | undefined {
  if (['company', 'lab', 'model', 'person', 'technology', 'institution', 'policy', 'dataset', 'infrastructure'].includes(kind)) return `/${kind}/${slug}/`;
  return undefined;
}

export function SeoPrerender({ route, metadata, snapshot }: SeoPrerenderProps) {
  const { stories, authors, sources, entities, timelineEvents } = snapshot;
  const isPublicEntity = (entity: (typeof entities)[number]) =>
    entity.kind !== 'person' || !authors.some((author) => author.slug === entity.slug && author.verifiedForPublication !== true);
  const articleSlug = route.match(/^\/article\/([^/]+)\/?$/)?.[1];
  if (articleSlug) {
    const story = stories.find((candidate) => candidate.slug === articleSlug);
    if (!story) {
      throw new Error(`Cannot prerender published article without its story snapshot: ${route}`);
    }

    const author = getStoryAuthorIdentity(story, authors);
    const relatedStories = story.relatedStories
      .map((relatedSlug) => {
        const exactMatch = stories.find((candidate) => candidate.slug === relatedSlug);
        if (exactMatch) return exactMatch;
        const aliasedStory = findStory(relatedSlug);
        return aliasedStory
          ? stories.find((candidate) => candidate.slug === aliasedStory.slug) ?? aliasedStory
          : undefined;
      })
      .filter((relatedStory): relatedStory is Story => Boolean(relatedStory));
    const publicDateModified = getPublicDateModified(story);
    const sectionHref = story.contentType === 'Report' ? '/reports/' : '/research/';
    const sectionLabel = story.contentType === 'Report' ? 'Reports' : 'Research';

    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main className="mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center pt-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <a href="/">Home</a><span className="mx-2">/</span><a href={sectionHref}>{sectionLabel}</a><span className="mx-2">/</span><span>{story.category}</span><span className="mx-2">/</span><span aria-current="page" className="max-w-[22rem] truncate">{story.title}</span>
          </nav>
          <article>
            <p className="mt-8 eyebrow text-primary">{story.category} · {story.contentType ?? getReaderFacingContentType(story.classification)}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[.9] tracking-[-.03em] md:text-7xl">{story.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">{story.dek}</p>
            <p className="mt-6 border-b border-foreground/15 pb-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {author
                ? <>By {author.type === 'Person' && author.slug
                  ? <a href={`/person/${author.slug}/`} className="font-semibold underline decoration-foreground/30 underline-offset-2 hover:text-primary">{author.name}</a>
                  : <strong className="font-semibold">{author.name}</strong>}
                  {author.type === 'Person'
                    ? ` · ${authors.find((candidate) => candidate.slug === author.slug)?.role ?? ''}`
                    : ''}
                </>
                : 'Byline unavailable'}
              {' · '}Published <time dateTime={story.date}>{formatEditorialDate(story.date)}</time>
              {publicDateModified && publicDateModified !== story.date
                ? <> · Updated <time dateTime={publicDateModified}>{formatEditorialDate(publicDateModified)}</time></>
                : null}
              {' · '}{getStoryReadTime(story)}
              {author?.type === 'Organization' && author.description
                ? <span className="mt-2 block font-sans text-[11px] normal-case leading-5 tracking-normal text-muted-foreground">{author.description}</span>
                : null}
            </p>
            <figure className="my-8 border border-foreground/15 bg-surface-muted">
              <img
                src={getEditorialImagePath(story.slug)}
                alt={metadata.imageAlt ?? story.imageTreatment.alt}
                width={1200}
                height={630}
                fetchPriority="high"
                className="aspect-[1.91/1] w-full object-cover"
              />
              <figcaption className="border-t border-foreground/15 px-4 py-3 text-xs leading-5 text-muted-foreground">
                Editorial illustration · {story.imageTreatment.caption}
              </figcaption>
            </figure>
            <div className="prose prose-lg mt-8 max-w-none text-foreground">
              <section className="not-prose my-8 border-l-2 border-primary bg-secondary/50 p-6">
                <p className="eyebrow text-primary">The bottom line</p>
                <p className="mt-3 font-serif text-3xl leading-none"><StoryCitedText text={story.bottomLine} story={story} sources={sources} /></p>
              </section>
              <section className="not-prose my-8">
                <p className="eyebrow text-primary">Why this matters</p>
                <p className="mt-3 text-lg leading-8"><StoryCitedText text={story.whyItMatters} story={story} sources={sources} /></p>
              </section>
              {story.keyTakeaways.length > 0 && (
                <section className="not-prose my-8 border-y border-foreground/15 py-6">
                  <p className="eyebrow text-primary">Key takeaways</p>
                  <ul className="mt-4 grid gap-3 text-sm">{story.keyTakeaways.map((takeaway) => <li key={takeaway} className="flex gap-3"><span className="text-primary">—</span><span><StoryCitedText text={takeaway} story={story} sources={sources} /></span></li>)}</ul>
                </section>
              )}
              <StoryBody story={story} sources={sources} />
            </div>
            <section className="my-10 border-t border-foreground/15 pt-6">
              <h2 className="eyebrow text-primary">What changes</h2>
              <p className="mt-3 max-w-3xl text-base leading-7"><StoryCitedText text={story.whatChanges} story={story} sources={sources} /></p>
            </section>
            {story.sources.length > 0 && <StorySourceList story={story} sources={sources} />}
          </article>
          <AdSlot placement="article" />
          {relatedStories.length > 0 && (
            <section className="border-t border-foreground/15 py-12">
              <h2 className="eyebrow mb-5 text-primary">Next stories</h2>
              <ul className="grid gap-4 md:grid-cols-3">
                {relatedStories.map((relatedStory) => <li key={relatedStory.slug} className="border-t border-foreground/15 pt-4"><a href={`/article/${relatedStory.slug}/`} className="font-serif text-xl leading-tight hover:text-primary">{relatedStory.title}</a><p className="mt-2 text-xs leading-5 text-muted-foreground">{relatedStory.dek}</p></li>)}
              </ul>
            </section>
          )}
        </main>
      </div>
    );
  }

  const personSlug = route.match(/^\/person\/([^/]+)\/?$/)?.[1];
  const authorRecord = personSlug ? authors.find((author) => author.slug === personSlug) : undefined;
  const person = authorRecord?.verifiedForPublication === true ? authorRecord : undefined;
  if (person) {
    const authoredStories = stories.filter((story) => story.author === person.slug);
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main>
          <section className="border-b border-foreground/20 py-14 md:py-20">
            <p className="eyebrow text-primary">People intelligence · contributor profile</p>
            <h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{person.name}</h1>
            <p className="mt-6 text-xl text-muted-foreground">{person.role} · {person.location}</p>
            <p className="mt-7 max-w-2xl text-lg leading-8">{person.bio}</p>
          </section>
          <section className="grid gap-10 py-12 md:grid-cols-[.65fr_1.35fr]">
            <div>
              <h2 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">Recent work</h2>
              <StoryList stories={authoredStories} authors={authors} />
            </div>
            <aside>
              <h2 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">About the desk</h2>
              <p className="text-sm leading-7">Global AI News contributors connect reported stories to the entities, sources and timelines that make the industry understandable.</p>
            </aside>
          </section>
        </main>
      </div>
    );
  }

  const entityMatch = route.match(/^\/(company|lab|model|technology|institution|policy|dataset|infrastructure|person)\/([^/]+)\/?$/);
  const entity = entityMatch && !(entityMatch[1] === 'person' && authorRecord && authorRecord.verifiedForPublication !== true)
    ? entities.find((candidate) => candidate.kind === entityMatch[1] && candidate.slug === entityMatch[2])
    : undefined;
  if (entity) {
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main>
          <section className="border-b border-foreground/20 py-14 md:py-20">
            <p className="eyebrow text-primary">{entity.kind} intelligence · profile</p>
            <h1 className="mt-6 font-serif text-7xl leading-[.84] md:text-[9rem]">{entity.name}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">{entity.strapline}</p>
            <p className="mt-7 max-w-2xl text-base leading-7">{entity.overview}</p>
          </section>
          <section className="grid gap-10 py-12 md:grid-cols-2">
            <div>
              <h2 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">Key metrics</h2>
              <ul className="grid gap-4">
                {entity.keyMetrics.map((metric) => <li key={metric.label} className="border-b border-foreground/15 pb-4"><b>{metric.label}: {metric.value}</b><p className="mt-1 text-sm text-muted-foreground">{metric.context}</p></li>)}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">Latest developments</h2>
              <ul className="grid gap-4">{entity.latestDevelopments.map((item) => <li key={item} className="border-b border-foreground/15 pb-4">{item}</li>)}</ul>
            </div>
          </section>
          <section className="border-t border-foreground/15 py-12">
            <h2 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">Recent stories</h2>
            <StoryList stories={stories.filter((story) => entity.recentStories.includes(story.slug))} authors={authors} />
          </section>
        </main>
      </div>
    );
  }

  const timelineSlug = route.match(/^\/timeline\/([^/]+)\/?$/)?.[1];
  const timelineEvent = timelineSlug
    ? timelineEvents.find((event) => event.slug === timelineSlug)
    : undefined;
  if (timelineEvent) {
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main>
          <section className="border-b border-foreground/20 py-14 md:py-20">
            <p className="eyebrow text-primary">Timeline event · <time dateTime={timelineEvent.date}>{formatEditorialDate(timelineEvent.date)}</time></p>
            <h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[8rem]">{timelineEvent.title}</h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-muted-foreground">{timelineEvent.description}</p>
          </section>
          {timelineEvent.story && <section className="py-12"><h2 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">Read the story</h2><StoryList stories={stories.filter((story) => story.slug === timelineEvent.story)} authors={authors} /></section>}
        </main>
      </div>
    );
  }

  if (route === '/research') {
    const records = snapshot.researchRecords
      .filter((record) => record.status === 'published' && stories.some((story) => story.slug === record.storySlug))
      .sort((a, b) => b.date.localeCompare(a.date));
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main className="mx-auto max-w-[1180px]">
          <section className="border-b border-foreground/20 py-14 md:py-20">
            <p className="eyebrow text-primary">Global AI News · Research register</p>
            <h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">Research, made traceable.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">Published research records show the question, method, evidence and limits behind our work. Follow each record into the reporting, data and sources.</p>
          </section>
          <section className="grid gap-10 py-12 md:grid-cols-[.55fr_1.45fr]">
            <aside>
              <h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">The register</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{records.length} published {records.length === 1 ? 'research record' : 'research records'} in this newsroom snapshot.</p>
            </aside>
            <div>
              {records.length ? records.map((record, index) => (
                <article key={record.slug} className="grid grid-cols-[2.6rem_1fr] gap-4 border-t border-foreground/15 py-7">
                  <span className="font-serif text-3xl text-primary/65">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="eyebrow text-primary">{record.provenance.replaceAll('-', ' ')} · published {formatEditorialDate(record.date)}</p>
                    <h2 className="mt-3 font-serif text-3xl leading-[.96]"><a href={`/research/${record.slug}/`} className="hover:text-primary">{record.title}</a></h2>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{record.researchQuestion}</p>
                    <p className="mt-4 text-xs text-muted-foreground">Updated {formatEditorialDate(record.updatedAt)} · {record.findings.length} findings · {record.limitations.length} stated limitations</p>
                  </div>
                </article>
              )) : <p className="border border-dashed border-foreground/20 p-7 text-sm text-muted-foreground">No research records are published in this newsroom snapshot.</p>}
            </div>
          </section>
        </main>
      </div>
    );
  }

  const researchMatch = route.match(/^\/research\/([^/]+)\/?$/);
  if (researchMatch) {
    const record = snapshot.researchRecords.find(
      (item) => item.slug === researchMatch[1] && item.status === 'published',
    );
    if (!record || !stories.some((story) => story.slug === record.storySlug)) {
      throw new Error(`Cannot prerender a published research route without its record and report: ${route}`);
    }
    const report = stories.find((story) => story.slug === record.storySlug);
    const researchAuthor = report
      ? getStoryAuthorIdentity(report, authors)
      : { type: 'Organization' as const, name: 'Global AI News Editorial Desk' };
    const relatedStories = [...new Set([record.storySlug, ...record.relatedStorySlugs])]
      .map((slug) => stories.find((story) => story.slug === slug))
      .filter((story): story is Story => Boolean(story));
    const relatedData = snapshot.dataProducts.filter(
      (product) => product.status === 'published' && record.dataProductSlugs.includes(product.slug),
    );
    const relatedTopics = snapshot.topics.filter((topic) => record.topicSlugs.includes(topic.slug));
    const relatedEntities = record.entitySlugs.flatMap((slug) => {
      const entity = entities.find((item) => item.slug === slug);
      const href = entity ? entityRoute(entity.kind, slug) : undefined;
      return entity && isPublicEntity(entity) && href ? [{ href, label: entity.name, detail: entity.strapline }] : [];
    });
    const relatedEvents = record.timelineSlugs.flatMap((slug) => {
      const event = timelineEvents.find((item) => item.slug === slug);
      return event ? [{ href: `/timeline/${slug}/`, label: event.title, detail: formatEditorialDate(event.date) }] : [];
    });
    const relatedSources = record.sourceSlugs.flatMap((slug) => {
      const source = sources.find((item) => item.slug === slug);
      return source ? [{ href: `/source/${slug}/`, label: source.name, detail: source.publisher }] : [];
    });
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main className="mx-auto max-w-[1240px]">
          <nav aria-label="Breadcrumb" className="pt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><a href="/research/">Research</a><span className="mx-2">/</span><span aria-current="page">{record.slug}</span></nav>
          <section className="border-b border-foreground/20 py-12 md:py-16">
            <p className="eyebrow text-primary">Research record · {record.provenance.replaceAll('-', ' ')} · {record.status}</p>
            <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[.88] tracking-[-.035em] md:text-8xl">{record.title}</h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-muted-foreground">{record.researchQuestion}</p>
          </section>
          <div className="grid gap-12 py-10 md:grid-cols-[minmax(0,1fr)_340px]">
            <article className="space-y-9">
              <section className="grid gap-5 border-b border-foreground/15 pb-6 sm:grid-cols-3">
                <p><span className="eyebrow text-muted-foreground">Published</span><time className="mt-2 block text-sm" dateTime={record.date}>{formatEditorialDate(record.date)}</time></p>
                <p><span className="eyebrow text-muted-foreground">Last reviewed</span><time className="mt-2 block text-sm" dateTime={record.updatedAt}>{formatEditorialDate(record.updatedAt)}</time></p>
                <p><span className="eyebrow text-muted-foreground">Author</span><span className="mt-2 block text-sm">{researchAuthor.name}</span>{researchAuthor.type === 'Organization' && researchAuthor.description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{researchAuthor.description}</span> : null}</p>
              </section>
              <section><h2 className="eyebrow mb-3 text-primary">Findings</h2><ol className="grid">{record.findings.map((finding, index) => <li key={finding} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-foreground/10 py-5"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')}</span><p className="max-w-3xl text-base leading-7">{finding}</p></li>)}</ol></section>
              <section className="grid gap-8 border-y border-foreground/15 py-7 sm:grid-cols-2"><div><h2 className="eyebrow mb-3 text-primary">Methodology</h2><p className="text-sm leading-7 text-muted-foreground">{record.methodology}</p></div><div><h2 className="eyebrow mb-3 text-primary">Dataset description</h2><p className="text-sm leading-7 text-muted-foreground">{record.datasetDescription}</p></div></section>
              <section><h2 className="eyebrow mb-3 text-primary">Limitations</h2><ul className="grid gap-3">{record.limitations.map((limitation) => <li key={limitation} className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">{limitation}</li>)}</ul></section>
              <section><h2 className="eyebrow mb-3 text-primary">Update history</h2>{record.updateHistory.map((entry) => <div key={`${entry.date}-${entry.summary}`} className="grid gap-2 border-t border-foreground/15 py-4 sm:grid-cols-[120px_1fr]"><time dateTime={entry.date} className="font-mono text-[10px] text-primary">{formatEditorialDate(entry.date)}</time><p className="text-sm leading-6">{entry.summary}</p></div>)}</section>
              {report && <section className="border-t border-foreground/15 pt-7"><h2 className="eyebrow mb-3 text-primary">Underlying report</h2><StoryList stories={[report]} authors={authors} /></section>}
            </article>
            <aside className="md:border-l md:border-foreground/15 md:pl-8">
              <AuthorityLinkList title="Related reporting" links={relatedStories.map((story) => ({ href: `/article/${story.slug}/`, label: story.title, detail: story.dek }))} />
              <AuthorityLinkList title="Data products" links={relatedData.map((product) => ({ href: `/data/${product.slug}/`, label: product.title, detail: product.description }))} />
              <AuthorityLinkList title="Topics" links={relatedTopics.map((topic) => ({ href: `${topic.route}/`, label: topic.label, detail: topic.description }))} />
              <AuthorityLinkList title="Entities" links={relatedEntities} />
              <AuthorityLinkList title="Timeline" links={relatedEvents} />
              <AuthorityLinkList title="Sources" links={relatedSources} />
            </aside>
          </div>
        </main>
      </div>
    );
  }

  if (/^\/data\/?$/.test(route)) {
    const products = snapshot.dataProducts
      .filter((product) => product.status === 'published' && product.storySlugs.some((slug) => stories.some((story) => story.slug === slug)))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main id="main-content" className="mx-auto max-w-[1180px]">
          <section className="border-b border-foreground/20 py-14 md:py-20">
            <p className="eyebrow text-primary">Global AI News · Data register</p>
            <h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">Data you can trace.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">Published data products show what is measured, how observations are grouped and which source records support them. Dated claims are not live inventories.</p>
          </section>
          <section className="grid gap-10 py-12 md:grid-cols-[.55fr_1.45fr]">
            <aside><h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">The register</h2><p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">{products.length} published {products.length === 1 ? 'data product' : 'data products'} in this newsroom snapshot.</p></aside>
            <div>{products.length ? products.map((product) => {
              const linkedSources = product.sourceSlugs.filter((slug) => sources.some((source) => source.slug === slug)).length;
              return <article key={product.slug} className="border-t border-foreground/15 py-7">
                <p className="eyebrow text-primary">Dataset · updated {formatEditorialDate(product.updatedAt)}</p>
                <h2 className="mt-3 max-w-3xl font-serif text-3xl leading-[.96]"><a href={`/data/${product.slug}/`} className="hover:text-primary">{product.title}</a></h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{product.description}</p>
                <p className="mt-4 text-xs text-muted-foreground">{product.observations.length} dated observations · {linkedSources} linked source records · unit: {product.unit}</p>
              </article>;
            }) : <p className="border border-dashed border-foreground/20 p-7 text-sm text-muted-foreground">No published data products are available in this newsroom snapshot.</p>}</div>
          </section>
        </main>
      </div>
    );
  }

  const dataMatch = route.match(/^\/data\/([^/]+)\/?$/);
  if (dataMatch) {
    const product = snapshot.dataProducts.find(
      (item) =>
        item.slug === dataMatch[1] &&
        item.status === 'published' &&
        item.storySlugs.some((slug) => stories.some((story) => story.slug === slug)),
    );
    if (!product) throw new Error(`Cannot prerender a published data route without its product and report: ${route}`);
    const linkedStories = product.storySlugs.flatMap((slug) => {
      const story = stories.find((item) => item.slug === slug);
      return story ? [story] : [];
    });
    const linkedResearch = snapshot.researchRecords.filter(
      (record) => record.status === 'published' && product.researchSlugs.includes(record.slug),
    );
    const linkedTopics = snapshot.topics.filter((topic) => product.topicSlugs.includes(topic.slug));
    const linkedEntities = product.entitySlugs.flatMap((slug) => {
      const entity = entities.find((item) => item.slug === slug);
      const href = entity ? entityRoute(entity.kind, slug) : undefined;
      return entity && isPublicEntity(entity) && href ? [{ href, label: entity.name, detail: entity.strapline }] : [];
    });
    const linkedEvents = product.timelineSlugs.flatMap((slug) => {
      const event = timelineEvents.find((item) => item.slug === slug);
      return event ? [{ href: `/timeline/${slug}/`, label: event.title, detail: formatEditorialDate(event.date) }] : [];
    });
    const linkedSources = product.sourceSlugs.flatMap((slug) => {
      const source = sources.find((item) => item.slug === slug);
      return source ? [{ href: `/source/${slug}/`, label: source.name, detail: source.publisher }] : [];
    });
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main className="mx-auto max-w-[1320px]">
          <nav aria-label="Breadcrumb" className="pt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><a href="/research/">Research</a><span className="mx-2">/</span><span aria-current="page">Data product</span></nav>
          <section className="border-b border-foreground/20 py-12 md:py-16">
            <p className="eyebrow text-primary">Data product · {product.evidenceType.replaceAll('-', ' ')}</p>
            <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[.88] tracking-[-.035em] md:text-8xl">{product.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">{product.description}</p>
          </section>
          <section className="grid gap-6 border-b border-foreground/15 py-7 sm:grid-cols-3"><p><span className="eyebrow text-muted-foreground">Last updated</span><time className="mt-2 block text-sm" dateTime={product.updatedAt}>{formatEditorialDate(product.updatedAt)}</time></p><p><span className="eyebrow text-muted-foreground">Observation unit</span><span className="mt-2 block text-sm">{product.unit}</span></p><p><span className="eyebrow text-muted-foreground">Evidence framing</span><span className="mt-2 block text-sm">Dated public-source claims</span></p></section>
          <section className="py-10">
            <h2 className="eyebrow text-primary">Recorded observations · {product.observations.length}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">These are dated claims, not a live inventory. Announcement does not establish installation, deployment, access, or scheduling.</p>
            <div className="mt-6 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-2">
              {product.observations.map((item) => {
                const source = sources.find((candidate) => candidate.slug === item.sourceSlug);
                return <article key={item.id} className="bg-background p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-foreground/15 pb-5"><div><p className="eyebrow text-primary">{item.stageLabel}</p><h3 className="mt-3 font-serif text-4xl leading-none">{item.quantityLabel}</h3></div><span className="border border-foreground/15 px-2 py-1 font-mono text-[10px] uppercase tracking-widest">{item.qualifier}</span></div>
                  <p className="mt-4 text-sm">{[item.organization, item.facility, item.location, item.geography].filter(Boolean).join(' · ')}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.acceleratorType}{item.providerCount !== undefined ? ` · ${item.providerCount} providers` : ''}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">{[
                    ['Source/report date', item.reportedOn ? formatEditorialDate(item.reportedOn) : 'Not stated by source'],
                    ['Source-stated snapshot date', item.asOf ? item.asOf === '2026-06' ? 'June 2026' : formatEditorialDate(item.asOf) : 'Not stated by source'],
                    ...(item.documentCreatedOn ? [['Document metadata date (not snapshot date)', formatEditorialDate(item.documentCreatedOn)]] : []),
                    ['Count unit', item.unit],
                    ['Denominator / count basis', item.denominator],
                    ['Source definition', item.definition],
                  ].map(([label, value]) => <div key={label} className="border-t border-foreground/10 pt-3"><dt className="eyebrow text-muted-foreground">{label}</dt><dd className="mt-2 text-sm leading-6">{value}</dd></div>)}</dl>
                  <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">{[['Installed', item.installed], ['Deployed', item.deployed], ['Accessible', item.accessible], ['Schedulable', item.schedulable]].map(([label, value]) => <div key={label} className="border-t border-foreground/10 pt-3"><dt className="eyebrow text-muted-foreground">{label}</dt><dd className="mt-2 text-sm capitalize">{String(value).replaceAll('-', ' ')}</dd></div>)}</dl>
                  <div className="mt-6 border-l-2 border-accent pl-4"><p className="eyebrow text-muted-foreground">Scope limitation</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.limitation}</p></div>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{item.sourceKind} source</p>
                  {source && <p className="mt-3 text-xs"><a href={`/source/${source.slug}/`} className="text-primary hover:underline">{source.name} · {source.publisher}</a></p>}
                </article>;
              })}
            </div>
          </section>
          <div className="grid gap-10 border-t border-foreground/15 py-10 md:grid-cols-2">
            <article><h2 className="eyebrow mb-3 text-primary">Methodology</h2><p className="text-sm leading-7 text-muted-foreground">{product.methodology}</p><h2 className="eyebrow mb-3 mt-8 text-primary">Limitations</h2><ul className="grid gap-3">{product.limitations.map((limitation) => <li key={limitation} className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">{limitation}</li>)}</ul></article>
            <aside>
              <AuthorityLinkList title="Research records" links={linkedResearch.map((record) => ({ href: `/research/${record.slug}/`, label: record.title, detail: record.researchQuestion }))} />
              <AuthorityLinkList title="Reporting" links={linkedStories.map((story) => ({ href: `/article/${story.slug}/`, label: story.title, detail: story.dek }))} />
              <AuthorityLinkList title="Topics" links={linkedTopics.map((topic) => ({ href: `${topic.route}/`, label: topic.label, detail: topic.description }))} />
              <AuthorityLinkList title="Entities" links={linkedEntities} />
              <AuthorityLinkList title="Timeline" links={linkedEvents} />
              <AuthorityLinkList title="Sources" links={linkedSources} />
            </aside>
          </div>
          <section className="border-t border-foreground/15 py-8"><h2 className="eyebrow mb-3 text-primary">Update history</h2>{product.updateHistory.map((entry) => <p key={`${entry.date}-${entry.summary}`} className="border-t border-foreground/10 py-4 text-sm leading-6"><time dateTime={entry.date} className="mr-4 font-mono text-[10px] text-primary">{formatEditorialDate(entry.date)}</time>{entry.summary}</p>)}</section>
        </main>
      </div>
    );
  }

  const topicMatch = route.match(/^\/topic\/([^/]+)\/?$/);
  if (topicMatch) {
    const topic = snapshot.topics.find((candidate) => candidate.slug === topicMatch[1]);
    if (topic) {
      const topicStories = topic.storySlugs.flatMap((slug) => {
        const story = stories.find((item) => item.slug === slug);
        return story ? [story] : [];
      });
      const topicResearch = snapshot.researchRecords.filter(
        (record) => record.status === 'published' && topic.researchSlugs.includes(record.slug),
      );
      const topicProducts = snapshot.dataProducts.filter(
        (product) => product.status === 'published' && topic.dataProductSlugs.includes(product.slug),
      );
      const topicEntities = topic.entitySlugs.flatMap((slug) => {
        const entity = entities.find((item) => item.slug === slug);
        const href = entity ? entityRoute(entity.kind, slug) : undefined;
        return entity && isPublicEntity(entity) && href ? [{ href, label: entity.name, detail: entity.strapline }] : [];
      });
      const topicSources = topic.sourceSlugs.flatMap((slug) => {
        const source = sources.find((item) => item.slug === slug);
        return source ? [{ href: `/source/${slug}/`, label: source.name, detail: source.publisher }] : [];
      });
      const topicEvents = topic.timelineSlugs.flatMap((slug) => {
        const event = timelineEvents.find((item) => item.slug === slug);
        return event ? [{ href: `/timeline/${slug}/`, label: event.title, detail: formatEditorialDate(event.date) }] : [];
      });
      return (
        <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
          <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
          <main className="mx-auto max-w-[1320px]">
            <section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Connected topic · {topic.label}</p><h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">{topic.label === 'India' ? 'India Watch' : topic.label}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">{topic.description}</p></section>
            <section className="grid gap-10 py-12 md:grid-cols-[.55fr_1.45fr]"><aside><h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">Important developments</h2><p className="mt-4 text-sm text-muted-foreground">{topicStories.length} published stories connected to this topic.</p></aside><ol className="border-t border-foreground/15">{topic.importantDevelopments.map((item, index) => <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-foreground/15 py-4 text-sm"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol></section>
            <section className="grid gap-12 border-y border-foreground/15 py-12 md:grid-cols-[1fr_320px]"><div><h2 className="eyebrow mb-4 text-primary">Reporting</h2><StoryList stories={topicStories} authors={authors} /></div><aside>
              <AuthorityLinkList title="Research" links={topicResearch.map((record) => ({ href: `/research/${record.slug}/`, label: record.title, detail: record.researchQuestion }))} />
              <AuthorityLinkList title="Data products" links={topicProducts.map((product) => ({ href: `/data/${product.slug}/`, label: product.title, detail: product.description }))} />
              <AuthorityLinkList title="Entities" links={topicEntities} />
              <AuthorityLinkList title="Sources" links={topicSources} />
              <AuthorityLinkList title="Timeline" links={topicEvents} />
            </aside></section>
          </main>
        </div>
      );
    }
  }

  const heading = metadata.title.replace(/\s+—\s+Global AI News$/, '');
  if (route === '/topics') {
    const topics = snapshot.topics
      .filter((topic) => topic.indexable)
      .map((topic) => ({
        topic,
        stories: topic.storySlugs.flatMap((slug) => {
          const story = stories.find((item) => item.slug === slug);
          return story ? [story] : [];
        }),
      }))
      .filter(({ stories: linkedStories }) => linkedStories.length > 0)
      .sort((left, right) => right.stories.length - left.stories.length || left.topic.label.localeCompare(right.topic.label));
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main className="mx-auto max-w-[1180px]">
          <section className="border-b border-foreground/20 py-14 md:py-20">
            <p className="eyebrow text-primary">Global AI News · Topic index</p>
            <h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">Topics that<br /><em className="text-primary">connect the record.</em></h1>
            <p className="mt-7 max-w-2xl text-lg leading-7 text-muted-foreground">Explore published reporting alongside its research, entities, sources, data and timeline.</p>
          </section>
          <section data-testid="topics-index" className="grid gap-px border-x border-b border-foreground/15 bg-foreground/15 py-10 md:grid-cols-2">
            {topics.length ? topics.map(({ topic, stories: linkedStories }) => <article key={topic.slug} className="bg-background p-6 md:p-8">
              <p className="eyebrow text-primary">Connected topic · {linkedStories.length} {linkedStories.length === 1 ? 'story' : 'stories'}</p>
              <h2 className="mt-5 font-serif text-4xl leading-none"><a href={`${topic.route}/`} className="hover:text-primary">{topic.label} →</a></h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{topic.description}</p>
              {topic.importantDevelopments.length > 0 && <ul className="mt-5 border-t border-foreground/15 pt-4 text-sm leading-6">{topic.importantDevelopments.slice(0, 3).map((item) => <li key={item} className="border-b border-foreground/10 py-2">{item}</li>)}</ul>}
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><span>{topic.entitySlugs.length} entities</span><span>{topic.researchSlugs.length} research</span><span>{topic.dataProductSlugs.length} data products</span><span>{topic.timelineSlugs.length} timeline events</span></div>
            </article>) : <p data-testid="topics-index-empty" className="bg-background p-8 text-sm text-muted-foreground">No indexable topic records with published reporting are available.</p>}
          </section>
        </main>
      </div>
    );
  }
  const comparisonReportSlug: ComparisonReportSlug | undefined =
    route === '/reports/ai-assistants-compared'
      ? 'ai-assistants-compared'
      : route === '/reports/ai-image-tools-compared'
        ? 'ai-image-tools-compared'
        : undefined;
  if (comparisonReportSlug) {
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/reports/" className="eyebrow text-primary">Reports</a>
        </header>
        <main className="mx-auto max-w-[1180px] py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <a href="/">Home</a><span className="mx-2">/</span><a href="/reports/">Reports</a>
          </nav>
          <ComparisonReportContent reportSlug={comparisonReportSlug} />
        </main>
      </div>
    );
  }
  if (route === '/reports') {
    const reports = stories.filter((story) => story.contentType === 'Report').sort((a, b) => b.date.localeCompare(a.date));
    const researchRecords = snapshot.researchRecords.filter((record) => record.status === 'published' && stories.some((story) => story.slug === record.storySlug)).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    const dataProducts = snapshot.dataProducts.filter((product) => product.status === 'published' && product.storySlugs.some((slug) => stories.some((story) => story.slug === slug))).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    const topics = snapshot.topics.filter((topic) => topic.indexable);
    const reportEntitySlugs = new Set(reports.flatMap((story) => story.entities));
    const entities = snapshot.entities.filter((entity) => reportEntitySlugs.has(entity.slug) && isPublicEntity(entity) && ['company', 'lab', 'model', 'person', 'technology', 'institution', 'policy', 'dataset', 'infrastructure'].includes(entity.kind));
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main className="mx-auto max-w-[1180px]">
          <section className="grid gap-9 border-b border-foreground/20 py-14 md:grid-cols-[1.2fr_.8fr] md:items-end md:py-20">
            <div><p className="eyebrow text-primary">Global AI News · Report desk</p><h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] tracking-[-.04em] md:text-[9rem]">Reports<span className="text-primary">.</span></h1><p className="mt-7 max-w-2xl text-lg leading-7 text-muted-foreground">Maintained reporting that follows the evidence beyond the headline — and maps what each finding changes across the AI industry.</p></div>
            <p className="max-w-sm border-l border-primary/30 pl-4 text-sm leading-6 text-muted-foreground">Every report is connected to its sources, people and events.</p>
          </section>
          <section className="grid gap-10 py-10 md:grid-cols-[.55fr_1.45fr] md:py-14">
            <div><h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">The report index</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">{reports.length} {reports.length === 1 ? 'maintained report' : 'maintained reports'}</p></div>
            {reports.length ? <div className="border-t border-foreground/15">{reports.map((story) => { const author = getStoryAuthorIdentity(story, authors); return <article key={story.slug} className="border-b border-foreground/15 py-6"><p className="eyebrow text-primary">Report · {story.category} · {getStoryReadTime(story)}</p><h2 className="mt-3 max-w-3xl font-serif text-3xl leading-[.95]"><a href={`/article/${story.slug}/`} className="hover:text-primary">{story.title}</a></h2><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{story.dek}</p><p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><time dateTime={story.date}>{formatEditorialDate(story.date)}</time>{' · '}By {author.name}</p><p className="mt-2 text-xs text-muted-foreground">Updated <time dateTime={story.dateModified ?? story.date}>{formatEditorialDate(story.dateModified ?? story.date)}</time></p></article>; })}</div> : <div className="border border-foreground/15 bg-surface-muted p-8"><h2 className="font-serif text-3xl">No reports are published yet.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">When a maintained report is published, it will appear here with its sources and connected context.</p></div>}
          </section>
          <section data-testid="reports-authority-network" className="grid gap-10 border-t border-foreground/15 py-12 md:grid-cols-2">
            <div><h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">Research</h2>{researchRecords.length ? researchRecords.map((record) => <a key={record.slug} href={`/research/${record.slug}/`} className="block border-b border-foreground/10 py-4 hover:text-primary"><span className="block text-sm">{record.title}</span><span className="mt-1 block text-xs text-muted-foreground">{record.provenance.replaceAll('-', ' ')} · updated {formatEditorialDate(record.updatedAt)}</span></a>) : <p className="py-4 text-sm text-muted-foreground">No published research records.</p>}</div>
            <div><h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">Data products</h2>{dataProducts.length ? dataProducts.map((product) => <a key={product.slug} href={`/data/${product.slug}/`} className="block border-b border-foreground/10 py-4 hover:text-primary"><span className="block text-sm">{product.title}</span><span className="mt-1 block text-xs text-muted-foreground">Updated {formatEditorialDate(product.updatedAt)} · {product.observations.length} dated observations</span></a>) : <p className="py-4 text-sm text-muted-foreground">No published data products.</p>}</div>
            <div><h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">Topics</h2>{topics.length ? topics.map((topic) => <a key={topic.slug} href={`${topic.route}/`} className="block border-b border-foreground/10 py-4 hover:text-primary"><span className="block text-sm">{topic.label}</span><span className="mt-1 block text-xs text-muted-foreground">{topic.description}</span></a>) : <p className="py-4 text-sm text-muted-foreground">No published topic records.</p>}</div>
            <div><h2 className="eyebrow border-b border-foreground/15 pb-3 text-primary">Entities</h2>{entities.length ? entities.map((entity) => <a key={entity.slug} href={`/${entity.kind}/${entity.slug}/`} className="block border-b border-foreground/10 py-4 hover:text-primary"><span className="block text-sm">{entity.name}</span><span className="mt-1 block text-xs text-muted-foreground">{entity.strapline ?? entity.kind}</span></a>) : <p className="py-4 text-sm text-muted-foreground">No connected entity records.</p>}</div>
          </section>
          <section className="grid gap-4 border-t border-foreground/15 py-10 md:grid-cols-2" aria-labelledby="comparison-reports-title">
            <h2 id="comparison-reports-title" className="sr-only">Comparison reports</h2>
            <a href="/reports/ai-assistants-compared/" className="border border-foreground/15 p-5 hover:border-primary">
              <span className="eyebrow text-primary">Comparison report</span>
              <span className="mt-3 block font-serif text-2xl">AI Assistants Compared</span>
              <span className="mt-2 block text-sm text-muted-foreground">Documented workflows, evidence dates and limitations.</span>
            </a>
            <a href="/reports/ai-image-tools-compared/" className="border border-foreground/15 p-5 hover:border-primary">
              <span className="eyebrow text-primary">Comparison report</span>
              <span className="mt-3 block font-serif text-2xl">AI Image Tools Compared</span>
              <span className="mt-2 block text-sm text-muted-foreground">Generation and editing features from current vendor documentation.</span>
            </a>
          </section>
        </main>
      </div>
    );
  }

  const editorialInputTitles: Record<string, string> = {
    '/archive': 'Archive',
    '/about-us': 'About us',
    '/code-of-ethics': 'Code of ethics',
    '/corrections': 'Corrections',
    '/contact-us': 'Contact us',
    '/privacy': 'Privacy notice',
    '/glucosmart-privacy': 'GlucoSmart Privacy Policy',
    '/terms': 'Terms of use',
    '/authors': 'Authors',
  };
  if (route === '/search') {
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main className="mx-auto max-w-[1180px] py-14 md:py-20">
          <p className="eyebrow text-primary">Search published stories</p>
          <h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">Find the<br /><em className="text-primary">record.</em></h1>
          <form action="/search/" method="get" className="mt-9 flex max-w-2xl gap-3 border-b border-foreground/40 py-3">
            <label htmlFor="prerender-search-query" className="sr-only">Search published stories</label>
            <input id="prerender-search-query" name="q" className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Search stories, topics and authors" />
            <button className="min-h-11 px-3 font-mono text-[10px] uppercase tracking-widest text-primary">Search</button>
          </form>
        </main>
      </div>
    );
  }
  if (route === '/glucosmart-privacy') {
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <GlucoSmartPrivacyContent />
      </div>
    );
  }
  if (editorialInputTitles[route]) {
    const copy = getEditorialPageCopy(route);
    const isArchive = route === '/archive';
    const archivedStories = [...stories].sort((left, right) => right.date.localeCompare(left.date));
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main id="main-content" className="mx-auto min-h-[60vh] max-w-[1180px] py-14 md:py-20" data-testid={isArchive ? 'published-archive' : `editorial-page-${route.slice(1)}`}>
          <p className="eyebrow text-primary">{isArchive ? `${archivedStories.length} published stories` : 'Global AI News · Editorial standards'}</p>
          <h1 className="mt-6 max-w-4xl font-serif text-6xl leading-[.88] md:text-8xl">{editorialInputTitles[route]}</h1>
          <p className="mt-7 max-w-3xl border-t border-foreground/15 pt-5 text-lg leading-8 text-muted-foreground">{copy.intro}</p>
          {isArchive
            ? <section className="mt-10"><h2 className="eyebrow mb-5 text-primary">Published archive</h2>{archivedStories.length ? <StoryList stories={archivedStories} authors={authors} /> : <p className="border-t border-foreground/15 py-6 text-sm text-muted-foreground">No published stories are available in the current newsroom snapshot.</p>}</section>
            : <div className="mt-10 max-w-3xl">
                {route === '/authors'
                  ? <AuthorDirectory stories={stories} authors={authors} />
                  : copy.sections.map((section) => <section key={section.heading} className="border-t border-foreground/15 py-6"><h2 className="font-serif text-3xl">{section.heading}</h2><p className="mt-3 text-base leading-7 text-muted-foreground">{section.body}</p></section>)}
              {copy.relatedLinks?.length ? <nav aria-label="Related publication pages" className="mt-8 flex flex-wrap gap-3 border-t border-foreground/15 pt-6">{copy.relatedLinks.map((link) => <a key={link.href} href={`${link.href}/`} className="flex min-h-11 items-center border border-foreground/15 px-4 text-sm hover:border-primary hover:text-primary">{link.label}</a>)}</nav> : null}
             </div>}
        </main>
      </div>
    );
  }
  if (metadata.indexable === false) {
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main className="mx-auto min-h-[60vh] max-w-[1180px] py-20 md:py-28">
          <p className="eyebrow text-primary">Global AI News</p>
          <h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">{heading}</h1>
          <p className="mt-8 max-w-xl border-t border-foreground/15 pt-5 text-lg leading-8 text-muted-foreground">{metadata.description}</p>
        </main>
      </div>
    );
  }
  if (route === '/') {
    const latestStory = getLatestStory(stories);
    const orderedStories = latestStory
      ? [latestStory, ...stories.filter((story) => story.slug !== latestStory.slug).sort((a, b) => b.date.localeCompare(a.date))]
      : [];
    const [lead, ...remainingStories] = orderedStories;
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <nav aria-label="Main navigation" className="hidden items-center gap-4 xl:flex">
            {[
              ['Brief', '/brief/'], ['Signals', '/signals/'], ['Research', '/research/'], ['Data', '/data/'],
              ['Reports', '/reports/'], ['Industry', '/industry/'], ['Models', '/models/'],
              ['Policy', '/policy/'], ['India', '/india/'], ['Essays', '/essays/'],
            ].map(([label, href]) => <a key={href} href={href} className="eyebrow text-muted-foreground hover:text-primary">{label}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <a href="/search/" className="eyebrow inline-flex min-h-11 items-center text-muted-foreground hover:text-primary">Search</a>
            <a href="/brief/#newsletter" className="eyebrow inline-flex min-h-11 items-center bg-primary px-3 py-2 text-primary-foreground">Join the brief</a>
            <details className="relative xl:hidden">
              <summary className="min-h-11 cursor-pointer list-none border border-foreground/20 px-3 py-2 font-mono text-[10px] uppercase tracking-widest">Explore</summary>
              <nav aria-label="Compact primary navigation" className="absolute right-0 z-20 mt-2 grid min-w-52 gap-3 border border-foreground/15 bg-background p-4 shadow-lg">
                {[
                  ['Brief', '/brief/'], ['Signals', '/signals/'], ['Research', '/research/'], ['Data', '/data/'],
                  ['Reports', '/reports/'], ['Industry', '/industry/'], ['Models', '/models/'],
                  ['Policy', '/policy/'], ['India', '/india/'], ['Essays', '/essays/'],
                ].map(([label, href]) => <a key={href} href={href} className="flex min-h-11 items-center text-sm hover:text-primary">{label}</a>)}
              </nav>
            </details>
          </div>
        </header>
        <main>
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
              </div>
              {lead ? <article className="flex flex-col justify-center border-l border-foreground/20 py-4 pl-6 md:pl-9">
                <img src={getEditorialImagePath(lead.slug)} alt={lead.imageTreatment.alt} width={1200} height={675} fetchPriority="high" className="mb-5 aspect-[16/9] w-full object-cover" />
                <p className="eyebrow text-primary">{lead.contentType ?? getReaderFacingContentType(lead.classification)} · {lead.category}</p>
                <a href={`/article/${lead.slug}/`} className="group block">
                  <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[.95] transition-colors group-hover:text-primary md:text-6xl">{lead.title}</h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{lead.dek}</p>
                </a>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Published <time dateTime={lead.date}>{formatEditorialDate(lead.date)}</time>
                  {lead.dateModified && lead.dateModified !== lead.date && <> · Updated <time dateTime={lead.dateModified}>{formatEditorialDate(lead.dateModified)}</time></>}
                  {' · '}{getStoryReadTime(lead)} · Global AI News Editorial Desk
                </p>
                <a href={`/article/${lead.slug}/`} className="mt-6 inline-flex min-h-11 w-fit items-center border-b border-primary pb-2 text-sm text-primary">Read the lead story <span className="ml-2" aria-hidden="true">↗</span></a>
              </article> : <p className="border border-foreground/15 p-6 text-sm text-muted-foreground">There are no published stories in the newsroom snapshot.</p>}
            </div>
          </section>
           <AdSlot placement="home" />
          <section className="grid gap-10 border-b border-foreground/20 py-12 md:grid-cols-[.75fr_1.25fr] md:py-16">
            <div><p className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">More from the newsroom · {remainingStories.length} stories</p><h2 className="max-w-sm font-serif text-5xl leading-[.9]">The useful read, not the loudest read.</h2><a href="/brief/" className="mt-8 inline-flex border-b border-primary pb-2 text-sm text-primary">Read the Daily Brief <span className="ml-2" aria-hidden="true">↗</span></a></div>
            <div className="grid gap-0">
              {remainingStories.slice(0, 5).map((story) => <article key={story.slug} className="grid gap-4 border-t border-foreground/15 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[128px_1fr]">
                <img src={getEditorialImagePath(story.slug)} alt={story.imageTreatment.alt} width={1200} height={675} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div><div className="flex items-center gap-2"><span className="eyebrow text-primary">{story.category}</span><span className="h-1 w-1 rounded-full bg-accent" /><time className="text-xs text-muted-foreground" dateTime={story.date}>{formatEditorialDate(story.date)}</time></div>
                  <a href={`/article/${story.slug}/`} className="mt-2 block max-w-2xl font-serif text-2xl leading-[.98] hover:text-primary md:text-3xl">{story.title}</a>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{story.dek}</p></div>
              </article>)}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
      <header className="flex items-center justify-between border-b border-foreground/20 py-5">
        <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
        <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
      </header>
      <main>
        <section className="border-b border-foreground/20 py-12 md:py-16">
          <p className="eyebrow text-primary">Global AI News · Editorial desk</p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-[.88] tracking-[-.03em] md:text-8xl">{heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-7 text-muted-foreground">{metadata.description}</p>
        </section>
        <section className="py-10 md:py-14">
          <StoryList stories={stories} authors={authors} idPrefix={route === '/brief' ? 'brief' : undefined} />
        </section>
        {route === '/brief' && (
          <section id="newsletter" className="border-y border-foreground/15 py-8">
            <p className="eyebrow text-primary">The Daily Brief · email edition</p>
            <h2 className="mt-3 font-serif text-4xl">Know what changed.</h2>
          </section>
        )}
      </main>
    </div>
  );
}
