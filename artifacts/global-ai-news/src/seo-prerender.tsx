import React from 'react';
import { findStory, getReaderFacingContentType, type NewsroomContentSnapshot, type Story } from './content';
import { formatEditorialDate, getLatestStory } from './editorial-date';
import type { SeoMetadata } from './seo-metadata';

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
            <p className="eyebrow text-primary">{story.category} · {story.readTime}</p>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl leading-[.95]">
              <a href={`/article/${story.slug}/`} className="hover:text-primary">{story.title}</a>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{story.dek}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <time dateTime={story.date}>{formatEditorialDate(story.date)}</time>
              {' · '}
              {authors.find((author) => author.slug === story.author)
                ? <a href={`/person/${story.author}/`} className="hover:text-primary">{authors.find((author) => author.slug === story.author)?.name}</a>
                : 'Byline unavailable'}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SeoPrerender({ route, metadata, snapshot }: SeoPrerenderProps) {
  const { stories, authors, sources, entities, timelineEvents } = snapshot;
  const articleSlug = route.match(/^\/article\/([^/]+)\/?$/)?.[1];
  if (articleSlug) {
    const story = stories.find((candidate) => candidate.slug === articleSlug);
    if (!story) {
      throw new Error(`Cannot prerender published article without its story snapshot: ${route}`);
    }

    const author = authors.find((candidate) => candidate.slug === story.author);
    const resolvedSources = story.sources
      .map((sourceSlug) => sources.find((candidate) => candidate.slug === sourceSlug))
      .filter((source): source is (typeof sources)[number] => Boolean(source));
    const missingSourceRecords = story.sources.length - resolvedSources.length;
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

    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center pt-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <a href="/">Home</a><span className="mx-2">/</span><a href="/research/">Research</a><span className="mx-2">/</span><span>{story.category}</span><span className="mx-2">/</span><span aria-current="page" className="max-w-[22rem] truncate">{story.title}</span>
          </nav>
          <article>
            <p className="mt-8 eyebrow text-primary">{story.category} · {getReaderFacingContentType(story.classification)}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[.9] tracking-[-.03em] md:text-7xl">{story.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">{story.dek}</p>
            <p className="mt-6 border-b border-foreground/15 pb-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {author
                ? <>By <a href={`/person/${author.slug}/`} className="font-semibold underline decoration-foreground/30 underline-offset-2 hover:text-primary">{author.name}</a> · {author.role}</>
                : 'Byline unavailable'}
              {' · '}Published <time dateTime={story.date}>{formatEditorialDate(story.date)}</time>
              {story.dateModified && story.dateModified !== story.date
                ? <> · Updated <time dateTime={story.dateModified}>{formatEditorialDate(story.dateModified)}</time></>
                : null}
              {' · '}{story.readTime}
            </p>
            <figure className="my-8 border border-foreground/15 bg-surface-muted">
              <img
                src={articleImagePath(story.slug)}
                alt={story.imageTreatment.alt}
                width={1200}
                height={630}
                fetchPriority="high"
                className="aspect-[1.91/1] w-full object-cover"
              />
              <figcaption className="border-t border-foreground/15 px-4 py-3 text-xs leading-5 text-muted-foreground">
                {story.imageTreatment.caption}
              </figcaption>
            </figure>
            <div className="prose prose-lg mt-8 max-w-none text-foreground">
              <section className="not-prose my-8 border-l-2 border-primary bg-secondary/50 p-6">
                <p className="eyebrow text-primary">The bottom line</p>
                <p className="mt-3 font-serif text-3xl leading-none">{story.bottomLine}</p>
              </section>
              <section className="not-prose my-8">
                <p className="eyebrow text-primary">Why this matters</p>
                <p className="mt-3 text-lg leading-8">{story.whyItMatters}</p>
              </section>
              {story.keyTakeaways.length > 0 && (
                <section className="not-prose my-8 border-y border-foreground/15 py-6">
                  <p className="eyebrow text-primary">Key takeaways</p>
                  <ul className="mt-4 grid gap-3 text-sm">{story.keyTakeaways.map((takeaway) => <li key={takeaway} className="flex gap-3"><span className="text-primary">—</span>{takeaway}</li>)}</ul>
                </section>
              )}
              {story.body.map((section, index) => (
                <section key={`${story.slug}-section-${index}`} className="mb-8">
                  <h2 className="font-serif text-3xl leading-tight">{section.heading}</h2>
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${story.slug}-paragraph-${index}-${paragraphIndex}`} className="mt-4 text-base leading-7">
                      {paragraph}
                    </p>
                  ))}
                  {section.pullQuote && (
                    <blockquote className="my-7 border-l-2 border-primary pl-5 font-serif text-2xl leading-tight text-primary">
                      {section.pullQuote}
                    </blockquote>
                  )}
                </section>
              ))}
            </div>
            <section className="my-10 border-t border-foreground/15 pt-6">
              <h2 className="eyebrow text-primary">What changes</h2>
              <p className="mt-3 max-w-3xl text-base leading-7">{story.whatChanges}</p>
            </section>
            {story.sources.length > 0 && (
              <section className="my-10 border-t border-foreground/15 pt-6" data-testid="article-sources">
                <h2 className="eyebrow text-primary">Sources</h2>
                <ul className="mt-4 grid gap-3 text-sm">
                  {resolvedSources.map((source) => (
                    <li key={source.slug} className="border-b border-foreground/10 pb-3">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{source.name}<span className="mt-1 block text-xs text-muted-foreground">{source.publisher} · {source.kind}</span></a>
                    </li>
                  ))}
                </ul>
                {missingSourceRecords > 0 && <p className="mt-3 text-xs text-warning">Some source records need editorial review before they can be linked.</p>}
              </section>
            )}
          </article>
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
  const person = personSlug ? authors.find((author) => author.slug === personSlug) : undefined;
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

  const entityMatch = route.match(/^\/(company|lab|model|technology|policy)\/([^/]+)\/?$/);
  const entity = entityMatch
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

  const heading = metadata.title.replace(/\s+—\s+Global AI News$/, '');
  const editorialInputTitles: Record<string, string> = {
    '/reports': 'Reports',
    '/topics': 'Topics',
    '/archive': 'Archive',
    '/about-us': 'About us',
    '/code-of-ethics': 'Code of ethics',
    '/corrections': 'Corrections',
    '/contact-us': 'Contact us',
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
            <button className="font-mono text-[10px] uppercase tracking-widest text-primary">Search</button>
          </form>
        </main>
      </div>
    );
  }
  if (editorialInputTitles[route]) {
    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5"><a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a><a href="/brief/" className="eyebrow text-primary">The Daily Brief</a></header>
        <main className="mx-auto min-h-[60vh] max-w-[1180px] py-20 md:py-28" data-testid="editorial-input-required">
          <p className="eyebrow text-primary">Editorial review pending</p>
          <h1 className="mt-6 max-w-4xl font-serif text-7xl leading-[.84] md:text-[9rem]">{editorialInputTitles[route]}</h1>
          <p className="mt-8 max-w-xl border-t border-foreground/15 pt-5 text-lg leading-8 text-muted-foreground">{metadata.description}</p>
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
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main>
          <section className="grid gap-8 border-b border-foreground/20 py-14 md:grid-cols-[.8fr_1.2fr] md:py-20">
            <div>
              <p className="eyebrow text-primary">Global AI News · Intelligence for the AI economy</p>
              <h1 className="mt-7 max-w-3xl font-serif text-6xl leading-[.84] tracking-[-.04em] md:text-8xl">
                Understand<br /><em className="text-primary">what changed.</em>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-7 text-muted-foreground">
                The place to understand the AI industry — through stories, signals, evidence and context.
              </p>
            </div>
            {lead && (
              <article className="border border-foreground/15 bg-surface-muted p-5 md:p-7">
                <a href={`/article/${lead.slug}/`}>
                  <img src={articleImagePath(lead.slug)} alt={lead.imageTreatment.alt} width={1200} height={630} fetchPriority="high" className="aspect-[1.91/1] w-full object-cover" />
            <p className="eyebrow mt-6 text-primary">{lead.category} · {formatEditorialDate(lead.date)} · {lead.readTime}</p>
                  <h2 className="mt-3 font-serif text-4xl leading-[.9] md:text-5xl">{lead.title}</h2>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">{lead.dek}</p>
                </a>
              </article>
            )}
          </section>
          <section className="py-12 md:py-16">
            <p className="eyebrow mb-7 text-primary">Latest stories</p>
            <StoryList stories={remainingStories} authors={authors} />
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
