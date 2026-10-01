import { createContext, useContext, type ReactNode } from 'react';
import {
  getGetNewsroomContentQueryKey,
  useGetNewsroomContent,
} from '@workspace/api-client-react';
import {
  hydrateContent,
  type NewsroomContentSnapshot,
} from '@/content';

const snapshotContext = createContext<NewsroomContentSnapshot | null>(null);

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
  const query = useGetNewsroomContent({
    query: {
      queryKey: getGetNewsroomContentQueryKey(),
      staleTime: 60_000,
      refetchInterval: 60_000,
      refetchIntervalInBackground: false,
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

  return (
    <snapshotContext.Provider value={snapshot}>
      {snapshot.stale && (
        <div
          data-testid="status-content-stale"
          className="border-b border-warning/40 bg-warning/10 px-5 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-warning"
        >
          Editorial source last refreshed outside the current publishing window
        </div>
      )}
      {children}
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