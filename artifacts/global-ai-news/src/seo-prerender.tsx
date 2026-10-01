import React from 'react';
import type { NewsroomContentSnapshot, Story } from './content';
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
                : story.author}
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

    return (
      <div className="editorial-page mx-auto min-h-screen max-w-[1440px] px-5 md:px-10">
        <header className="flex items-center justify-between border-b border-foreground/20 py-5">
          <a href="/" className="font-serif text-2xl tracking-tight">Global AI News</a>
          <a href="/brief/" className="eyebrow text-primary">The Daily Brief</a>
        </header>
        <main className="mx-auto max-w-4xl">
          <article>
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
            <p className="eyebrow text-primary">{story.category} · {story.classification} · {story.readTime}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[.9] tracking-[-.03em] md:text-7xl">{story.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">{story.dek}</p>
            <p className="mt-6 border-b border-foreground/15 pb-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {authors.find((author) => author.slug === story.author)
                ? <a href={`/person/${story.author}/`} className="hover:text-primary">{authors.find((author) => author.slug === story.author)?.name}</a>
                : story.author}
              {authors.find((author) => author.slug === story.author)?.role
                ? ` · ${authors.find((author) => author.slug === story.author)?.role}`
                : ''}
              {' · '}<time dateTime={story.date}>{formatEditorialDate(story.date)}</time> · {story.readTime}
            </p>
            <div className="prose prose-lg mt-8 max-w-none text-foreground">
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
            <section className="my-10 grid gap-6 border-y border-foreground/20 py-7 md:grid-cols-2">
              <div>
                <h2 className="eyebrow text-primary">The bottom line</h2>
                <p className="mt-3 font-serif text-2xl leading-tight">{story.bottomLine}</p>
              </div>
              <div>
                <h2 className="eyebrow text-primary">Why it matters</h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{story.whyItMatters}</p>
              </div>
            </section>
            {story.keyTakeaways.length > 0 && (
              <section className="my-10">
                <h2 className="font-serif text-3xl">Key takeaways</h2>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7">
                  {story.keyTakeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
                </ul>
              </section>
            )}
            <section className="my-10 border-t border-foreground/15 pt-6">
              <h2 className="eyebrow text-primary">What changes</h2>
              <p className="mt-3 max-w-3xl text-base leading-7">{story.whatChanges}</p>
            </section>
            <section className="my-10 border-t border-foreground/15 pt-6">
              <h2 className="eyebrow text-primary">Sources</h2>
              <ul className="mt-4 grid gap-3 text-sm">
                {story.sources.map((slug) => {
                  const source = sources.find((candidate) => candidate.slug === slug);
                  return (
                    <li key={slug} className="border-b border-foreground/10 pb-3">
                      {source
                        ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{source.name}<span className="mt-1 block text-xs text-muted-foreground">{source.publisher} · {source.kind}</span></a>
                        : slug}
                    </li>
                  );
                })}
              </ul>
            </section>
          </article>
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
            <p className="eyebrow text-primary">Timeline event · {timelineEvent.date}</p>
            <h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[8rem]">{timelineEvent.title}</h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-muted-foreground">{timelineEvent.description}</p>
          </section>
          {timelineEvent.story && <section className="py-12"><h2 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">Read the story</h2><StoryList stories={stories.filter((story) => story.slug === timelineEvent.story)} authors={authors} /></section>}
        </main>
      </div>
    );
  }

  const heading = metadata.title.replace(/\s+—\s+Global AI News$/, '');
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
