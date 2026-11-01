import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getGetNewsroomContentQueryKey,
  useGetNewsroomContent,
} from '@workspace/api-client-react';
import {
  hydrateContent,
  type NewsroomContentSnapshot,
} from '@/content';
import { getVisibleReleaseArticles, type PublicPublicationState } from '@/publication-state';

const snapshotContext = createContext<NewsroomContentSnapshot | null>(null);
type PublicRegistryArticle = ReturnType<typeof getVisibleReleaseArticles>[number];
const releaseArticlesContext = createContext<PublicRegistryArticle[]>([]);
export type PublishedReleaseDiscovery = {
  briefs: Array<{ slug: string; articleSlug: string; publishAt: string; title: string; dek: string; body: string }>;
  signals: Array<{ slug: string; articleSlug: string; publishAt: string; label: string; value: string; date: string; source: string; tier: number; confidence: string; evidenceTag: string; topic: string }>;
  topics: Array<{ slug: string; label: string; route: string; description: string; storySlugs: string[]; indexable: boolean }>;
  glossaryLinks: Array<{ articleSlug: string; publishAt: string; route: string; terms: string[] }>;
};
const emptyReleaseDiscovery: PublishedReleaseDiscovery = { briefs: [], signals: [], topics: [], glossaryLinks: [] };
const releaseDiscoveryContext = createContext(emptyReleaseDiscovery);
const NEWSROOM_CONTENT_STALE_TIME_MS = 10 * 60_000;

function StatusPanel({ title, detail, retry }: { title: string; detail: string; retry?: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-16 md:px-10">
      <p className="eyebrow text-primary">Global AI News · newsroom source</p>
      <h1 className="mt-5 font-serif text-6xl leading-[.9]">{title}</h1>
      <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">{detail}</p>
      {retry && (
        <button
          data-testid="button-content-retry"
          type="button"
          onClick={retry}
          className="mt-8 w-fit border border-primary px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-primary"
        >
          Try again
        </button>
      )}
    </main>
  );
}

export function NewsroomProvider({ children }: { children: ReactNode }) {
  const publicationStateQuery = useQuery({
    queryKey: ['newsroom', 'publication-state'],
    queryFn: async () => {
      const response = await fetch('/api/newsroom/publication-state', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Publication state request failed (${response.status}).`);
      return response.json() as Promise<{ states: Array<{ slug: string; publishAt: string; status: string }> }>;
    },
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
  const releaseDiscoveryQuery = useQuery({
    queryKey: ['newsroom', 'release-discovery'],
    queryFn: async () => {
      const response = await fetch('/api/newsroom/release-discovery', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Release discovery request failed (${response.status}).`);
      return response.json() as Promise<PublishedReleaseDiscovery>;
    },
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
  const query = useGetNewsroomContent({
    query: {
      queryKey: getGetNewsroomContentQueryKey(),
      staleTime: NEWSROOM_CONTENT_STALE_TIME_MS,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retry: 2,
    },
  });

  if (query.isLoading) {
    return (
      <StatusPanel
        title="Reading the newsroom."
        detail="We’re loading the latest stories, signals and connected records."
      />
    );
  }

  if (query.isError || !query.data) {
    return (
      <StatusPanel
        title="The newsroom is between editions."
        detail="The editorial source did not respond. Nothing has been replaced with stale local content; try again when the source is available."
        retry={() => void query.refetch()}
      />
    );
  }

  const snapshot = query.data as unknown as NewsroomContentSnapshot & {
    generatedAt: string;
    source: string;
    stale: boolean;
  };

  if (snapshot.stories.length === 0) {
    return (
      <StatusPanel
        title="No stories are published yet."
        detail="The newsroom source is reachable, but it has not returned a publishable edition."
        retry={() => void query.refetch()}
      />
    );
  }

  hydrateContent(snapshot);
  const publishedRegistryArticles = getVisibleReleaseArticles(
    (publicationStateQuery.data?.states ?? []) as PublicPublicationState[],
  );

  return (
    <snapshotContext.Provider value={snapshot}>
      <releaseArticlesContext.Provider value={publishedRegistryArticles}>
        <releaseDiscoveryContext.Provider value={releaseDiscoveryQuery.data ?? emptyReleaseDiscovery}>
          {children}
        </releaseDiscoveryContext.Provider>
      </releaseArticlesContext.Provider>
    </snapshotContext.Provider>
  );
}

export function useNewsroomSnapshot(): NewsroomContentSnapshot {
  const snapshot = useContext(snapshotContext);
  if (!snapshot) {
    throw new Error('useNewsroomSnapshot must be used inside NewsroomProvider');
  }
  return snapshot;
}

export function usePublishedRegistryArticles(): PublicRegistryArticle[] {
  return useContext(releaseArticlesContext);
}

export function usePublishedReleaseDiscovery(): PublishedReleaseDiscovery {
  return useContext(releaseDiscoveryContext);
}