import React from 'react';
import { getStoryAuthorIdentity, type Author, type Story } from '../content';

interface DirectoryEntry {
  key: string;
  name: string;
  description: string;
  role?: string;
  profilePath?: string;
  storyCount: number;
}

function getDirectoryEntries(stories: readonly Story[], authors: readonly Author[]): DirectoryEntry[] {
  const entries = new Map<string, DirectoryEntry>();

  for (const story of stories) {
    const identity = getStoryAuthorIdentity(story, authors);
    const key = identity.type === 'Person' && identity.slug
      ? `person:${identity.slug}`
      : 'organization:editorial-desk';
    const current = entries.get(key);
    if (current) {
      current.storyCount += 1;
      continue;
    }

    if (identity.type === 'Person' && identity.slug) {
      const author = authors.find(
        (candidate) =>
          candidate.slug === identity.slug &&
          candidate.verifiedForPublication === true,
      );
      if (!author) continue;
      entries.set(key, {
        key,
        name: author.name,
        description: author.bio,
        role: author.role,
        profilePath: `/person/${author.slug}/`,
        storyCount: 1,
      });
      continue;
    }

    entries.set(key, {
      key,
      name: identity.name,
      description: identity.description ?? '',
      storyCount: 1,
    });
  }

  return [...entries.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function AuthorDirectory({
  stories,
  authors,
}: {
  stories: readonly Story[];
  authors: readonly Author[];
}) {
  const entries = getDirectoryEntries(stories, authors);

  return (
    <section
      data-testid="author-directory"
      aria-labelledby="author-directory-heading"
      className="mt-10 max-w-3xl"
    >
      <h2 id="author-directory-heading" className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-primary">
        Published bylines
      </h2>
      {entries.length ? (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <article key={entry.key} className="border border-foreground/15 bg-surface-muted/30 p-5 md:p-6">
              <h3 className="font-serif text-2xl">
                {entry.profilePath ? (
                  <a href={entry.profilePath} className="hover:text-primary">{entry.name}</a>
                ) : entry.name}
              </h3>
              {entry.role ? <p className="mt-2 eyebrow text-primary">{entry.role}</p> : null}
              {entry.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.description}</p> : null}
              <p className="mt-4 border-t border-foreground/10 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Credited on {entry.storyCount} published {entry.storyCount === 1 ? 'story' : 'stories'}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="border border-foreground/15 p-5 text-sm leading-6 text-muted-foreground">
          No published bylines are available in the current newsroom snapshot.
        </p>
      )}
    </section>
  );
}
