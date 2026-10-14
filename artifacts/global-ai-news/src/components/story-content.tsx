import React from 'react';
import type { Source, Story } from '@/content';

function sourceSpecificUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return undefined;
    return parsed.pathname === '/' && !parsed.search && !parsed.hash ? undefined : url;
  } catch {
    return undefined;
  }
}

function CitedText({
  text,
  story,
  sources,
}: {
  text: string;
  story: Story;
  sources: Source[];
}) {
  const pieces = text.split(/(\[@[a-z0-9-]+\])/g);
  return pieces.map((piece, index) => {
    const match = piece.match(/^\[@([a-z0-9-]+)\]$/);
    if (!match) return piece;

    const sourceSlug = match[1];
    const source = sources.find((candidate) => candidate.slug === sourceSlug);
    const citationNumber = story.sources.indexOf(sourceSlug) + 1;
    if (!source || citationNumber === 0) {
      return (
        <span
          key={`${sourceSlug}-${index}`}
          className="text-warning"
          title={`Unresolved source citation: ${sourceSlug}`}
        >
          [source not found]
        </span>
      );
    }

    return (
      <a
        key={`${sourceSlug}-${index}`}
        href={`#source-${citationNumber}`}
        aria-label={`Source ${citationNumber}: ${source.name}, jump to citation details`}
        className="mx-0.5 inline-flex min-h-7 min-w-7 items-center justify-center px-1 align-super font-mono text-[0.72em] font-semibold text-primary underline decoration-primary/40 underline-offset-2"
      >
        [{citationNumber}]
      </a>
    );
  });
}

export function StoryBody({ story, sources }: { story: Story; sources: Source[] }) {
  return (
    <>
      {story.body.map((section, sectionIndex) => (
        <section key={`${story.slug}-section-${sectionIndex}`} className="mb-8">
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`${story.slug}-paragraph-${sectionIndex}-${paragraphIndex}`}>
              <CitedText text={paragraph} story={story} sources={sources} />
            </p>
          ))}
          {section.pullQuote && (
            <blockquote>
              <CitedText text={section.pullQuote} story={story} sources={sources} />
            </blockquote>
          )}
          {section.table && (
            <div className="not-prose my-8 overflow-x-auto border border-foreground/15">
              <table className={`w-full ${section.table.headers.includes('Source-stated snapshot date') ? 'min-w-[72rem]' : 'min-w-[44rem]'} border-collapse text-left text-sm`}>
                {section.table.caption && (
                  <caption className="border-b border-foreground/15 bg-surface-muted px-4 py-3 text-left font-serif text-lg">
                    {section.table.caption}
                  </caption>
                )}
                <thead className="bg-secondary/50">
                  <tr>
                    {section.table.headers.map((header) => (
                      <th key={header} scope="col" className="border-b border-foreground/15 px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, rowIndex) => (
                    <tr key={`${story.slug}-table-row-${rowIndex}`} className="align-top">
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={`${story.slug}-table-${rowIndex}-${cellIndex}`}
                          className="border-b border-foreground/10 px-4 py-3 leading-6"
                        >
                          <CitedText text={cell} story={story} sources={sources} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </>
  );
}

export function StorySourceList({
  story,
  sources,
}: {
  story: Story;
  sources: Source[];
}) {
  const resolvedSources = story.sources
    .map((slug) => sources.find((source) => source.slug === slug))
    .filter((source): source is Source => Boolean(source));
  const missingCount = story.sources.length - resolvedSources.length;

  return (
    <section className="not-prose mt-10" data-testid="article-sources">
      <h2 className="eyebrow text-primary">Sources</h2>
      <ol className="mt-4 grid gap-3">
        {resolvedSources.map((source) => {
          const citationNumber = story.sources.indexOf(source.slug) + 1;
          const externalUrl = sourceSpecificUrl(source.url);
          return (
            <li key={source.slug} id={`source-${citationNumber}`} className="border-b border-foreground/15 pb-3 text-sm">
              <a
                href={externalUrl ?? `/source/${source.slug}/`}
                {...(externalUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block min-h-11 py-1 hover:text-primary"
              >
                <span className="mr-2 font-mono text-primary">[{citationNumber}]</span>
                {source.name}
                <span className="mt-1 block text-xs text-muted-foreground">
                  {source.publisher}
                  {source.tier ? ` · Tier ${source.tier}` : ''}
                  {source.publicationDate ? ` · Published ${source.publicationDate}` : ''}
                  {source.accessed ? ` · Accessed ${source.accessed}` : ''}
                </span>
              </a>
              {!externalUrl && <p role="note" className="mt-2 border-l-2 border-accent pl-3 text-xs leading-5 text-muted-foreground">The maintained URL does not identify a source-specific document. Open the citation record for its scope and limitations.</p>}
              {source.scopeNote && (
                <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">{source.scopeNote}</p>
              )}
            </li>
          );
        })}
      </ol>
      {missingCount > 0 && (
        <p role="status" className="mt-3 text-xs text-warning">
          {missingCount} cited source {missingCount === 1 ? 'record needs' : 'records need'} editorial review before linking.
        </p>
      )}
    </section>
  );
}

export function StoryCitedText({
  text,
  story,
  sources,
}: {
  text: string;
  story: Story;
  sources: Source[];
}) {
  return <CitedText text={text} story={story} sources={sources} />;
}