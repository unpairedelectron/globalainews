import React from 'react';
import type { Story } from './content';
import type { SeoMetadata } from './seo-metadata';

interface SeoPrerenderProps {
  route: string;
  metadata: SeoMetadata;
  stories: Story[];
}

function articleImagePath(slug: string): string {
  return `/social/articles/${slug}.png`;
}

function StoryList({ stories }: { stories: Story[] }) {
  return (
    <div className="grid gap-8">
      {stories.map((story) => (
        <article key={story.slug} className="grid gap-5 border-b border-foreground/15 pb-8 sm:grid-cols-[220px_1fr]">
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
              {story.date} · {story.author}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SeoPrerender({ route, metadata, stories }: SeoPrerenderProps) {
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
            <p className="eyebrow text-primary">{story.category} · {story.readTime}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[.9] tracking-[-.03em] md:text-7xl">{story.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">{story.dek}</p>
            <p className="mt-6 border-b border-foreground/15 pb-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {story.author} · <time dateTime={story.date}>{story.date}</time> · {story.readTime}
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
          </article>
        </main>
      </div>
    );
  }

  const heading = metadata.title.replace(/\s+—\s+Global AI News$/, '');
  if (route === '/') {
    const [lead, ...remainingStories] = stories;
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
                  <p className="eyebrow mt-6 text-primary">{lead.category} · {lead.readTime}</p>
                  <h2 className="mt-3 font-serif text-4xl leading-[.9] md:text-5xl">{lead.title}</h2>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">{lead.dek}</p>
                </a>
              </article>
            )}
          </section>
          <section className="py-12 md:py-16">
            <p className="eyebrow mb-7 text-primary">Latest stories</p>
            <StoryList stories={remainingStories} />
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
          <StoryList stories={stories} />
        </section>
      </main>
    </div>
  );
}
