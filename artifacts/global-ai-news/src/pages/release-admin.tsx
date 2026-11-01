import { useEffect, useState } from 'react';
import { useAuth, useClerk } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, FileUp, RefreshCw } from 'lucide-react';
import { Link } from '@/components/canonical-link';
import { Footer, Header, SectionLabel, SeoHead } from '@/components/site';
import {
  getGetNewsroomReleaseHistoryQueryKey,
  getGetPublicationStateManifestQueryKey,
  useActOnPublicationState,
  useGetNewsroomReleaseHistory,
  useGetPublicationStateManifest,
  useImportPublicationStateManifest,
} from '@workspace/api-client-react';

const container = 'editorial-page mx-auto max-w-[1440px] px-5 md:px-10';

export function ReleaseAdminPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const manifestQuery = useGetPublicationStateManifest({ query: {
    queryKey: getGetPublicationStateManifestQueryKey(),
    enabled: isLoaded && Boolean(isSignedIn),
    retry: false,
  } });
  const historyQuery = useGetNewsroomReleaseHistory(undefined, { query: {
    queryKey: getGetNewsroomReleaseHistoryQueryKey(),
    enabled: isLoaded && Boolean(isSignedIn),
    retry: false,
  } });
  const importMutation = useImportPublicationStateManifest();
  const actionMutation = useActOnPublicationState();
  const [manifestText, setManifestText] = useState('');
  const [preview, setPreview] = useState<Awaited<ReturnType<typeof importMutation.mutateAsync>> | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (manifestQuery.data && !manifestText) setManifestText(JSON.stringify(manifestQuery.data, null, 2));
  }, [manifestQuery.data, manifestText]);

  async function readManifestFile(file?: File) {
    if (!file) return;
    setManifestText(await file.text());
    setPreview(null);
    setMessage(`Loaded ${file.name}. Review the state-only JSON, then run a dry run.`);
  }

  async function runDryRun() {
    try {
      const parsed = JSON.parse(manifestText);
      const result = await importMutation.mutateAsync({ data: { ...parsed, apply: false } });
      setPreview(result);
      setMessage(`Dry run complete: ${result.changes.length} entries checked; no state was written.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The manifest could not be checked.');
    }
  }

  async function applyManifest() {
    if (!preview) return;
    if (!window.confirm('Apply these publication-state changes? This writes only publish-state and audit rows.')) return;
    try {
      const result = await importMutation.mutateAsync({ data: { ...JSON.parse(manifestText), apply: true } });
      setPreview(result);
      setMessage(`Applied ${result.changes.filter((change) => change.disposition !== 'unchanged').length} state changes.`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetPublicationStateManifestQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetNewsroomReleaseHistoryQueryKey() }),
        queryClient.invalidateQueries({ queryKey: ['newsroom', 'publication-state'] }),
        queryClient.invalidateQueries({ queryKey: ['newsroom', 'release-discovery'] }),
      ]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The manifest could not be applied.');
    }
  }

  async function act(slug: string, action: 'publish-now' | 'pause' | 'rollback') {
    const prompts = {
      'publish-now': `Publish ${slug} now?`,
      pause: `Pause ${slug}?`,
      rollback: `Roll back the latest audited state change for ${slug}?`,
    };
    if (!window.confirm(prompts[action])) return;
    try {
      await actionMutation.mutateAsync({ slug, data: { action } });
      setMessage(`${action} completed for ${slug}.`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetPublicationStateManifestQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetNewsroomReleaseHistoryQueryKey() }),
        queryClient.invalidateQueries({ queryKey: ['newsroom', 'publication-state'] }),
        queryClient.invalidateQueries({ queryKey: ['newsroom', 'release-discovery'] }),
      ]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Could not ${action} ${slug}.`);
    }
  }

  return <>
    <SeoHead title="Release administration — Global AI News" description="Authenticated publication-state controls for editors." path="/admin/release" />
    <Header />
    <main className={`${container} min-h-[70vh] py-10 md:py-16`}>
      <p className="eyebrow text-primary">Global AI News · editor-only</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-5 border-b border-foreground/20 pb-7">
        <div><h1 className="font-serif text-5xl md:text-7xl">Release desk.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Manage publish state only. Article structure and citations remain in the repository; this screen never imports article bodies.</p></div>
        {isSignedIn && <button type="button" onClick={() => void signOut({ redirectUrl: '/' })} className="min-h-11 border border-foreground/20 px-4 text-sm hover:border-primary">Sign out</button>}
      </div>

      {!isLoaded ? <p role="status" className="py-10 text-sm text-muted-foreground">Checking editor sign-in…</p>
        : !isSignedIn ? <section className="mt-8 border border-foreground/15 p-6">
          <h2 className="font-serif text-2xl">Editor sign-in required</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with the configured, verified editor account to access release controls.</p>
          <Link href="/sign-in?redirect_url=/admin/release" className="mt-5 inline-flex min-h-11 items-center border-b border-primary text-sm text-primary">Continue to sign in <ArrowUpRight size={14} className="ml-2" /></Link>
        </section>
        : <>
          {(manifestQuery.isError || historyQuery.isError) && <p role="alert" className="mt-6 border border-destructive/40 p-4 text-sm text-destructive">Editor access was denied or the release service is unavailable. Only the configured verified editor can read or change this state.</p>}
          <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <div>
              <SectionLabel>State-only manifest</SectionLabel>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Dry-run is the default. The server accepts exactly the ten known slugs, scheduled UTC dates and statuses; no story content or citations are accepted.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-foreground/20 px-4 text-sm hover:border-primary"><FileUp size={15} /> Load JSON file<input type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void readManifestFile(event.currentTarget.files?.[0])} /></label>
                <button type="button" onClick={() => void manifestQuery.refetch()} className="inline-flex min-h-11 items-center gap-2 border border-foreground/20 px-4 text-sm hover:border-primary"><RefreshCw size={14} /> Load current manifest</button>
              </div>
              <textarea aria-label="State-only release manifest JSON" spellCheck={false} value={manifestText} onChange={(event) => { setManifestText(event.target.value); setPreview(null); }} className="mt-4 min-h-72 w-full border border-foreground/20 bg-background p-4 font-mono text-xs leading-5" />
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" disabled={importMutation.isPending || !manifestText} onClick={() => void runDryRun()} className="min-h-11 bg-primary px-5 text-sm text-primary-foreground disabled:opacity-50">Dry run</button>
                <button type="button" disabled={!preview || importMutation.isPending || preview.changes.every((change) => change.disposition === 'unchanged')} onClick={() => void applyManifest()} className="min-h-11 border border-primary px-5 text-sm text-primary disabled:opacity-50">Apply changes</button>
              </div>
              {message && <p role="status" className="mt-4 border-t border-foreground/15 py-3 text-sm">{message}</p>}
              {preview && <div className="mt-4 border border-foreground/15 p-4"><p className="eyebrow text-primary">{preview.dryRun ? 'Dry-run preview' : 'Applied result'}</p><ul className="mt-3 grid gap-2 font-mono text-xs">{preview.changes.map((change) => <li key={change.slug}>{change.disposition.toUpperCase()} · {change.slug} · {change.previousStatus ?? 'none'} → {change.nextStatus}</li>)}</ul></div>}
            </div>

            <div>
              <SectionLabel>Article controls</SectionLabel>
              {manifestQuery.isLoading ? <p className="py-6 text-sm text-muted-foreground">Loading publication state…</p> : <div className="mt-3 divide-y divide-foreground/15 border-y border-foreground/15">
                {(manifestQuery.data?.states ?? []).map((state) => <article key={state.slug} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-mono text-xs">{state.slug}</h2><span className="eyebrow text-primary">{state.status}</span></div>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">{new Date(state.publishAt).toISOString()}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={actionMutation.isPending} onClick={() => void act(state.slug, 'publish-now')} className="min-h-10 border border-foreground/20 px-3 text-xs hover:border-primary">Publish now</button>
                    <button type="button" disabled={actionMutation.isPending} onClick={() => void act(state.slug, 'pause')} className="min-h-10 border border-foreground/20 px-3 text-xs hover:border-primary">Pause</button>
                    <button type="button" disabled={actionMutation.isPending} onClick={() => void act(state.slug, 'rollback')} className="min-h-10 border border-foreground/20 px-3 text-xs hover:border-primary">Roll back</button>
                  </div>
                </article>)}
              </div>}
            </div>
          </section>
          <section className="mt-14">
            <SectionLabel>Recent audit history</SectionLabel>
            {historyQuery.isLoading ? <p className="py-6 text-sm text-muted-foreground">Loading audit history…</p> : <div className="mt-3 divide-y divide-foreground/15 border-y border-foreground/15">
              {(historyQuery.data ?? []).map((entry) => <article key={entry.id} className="grid gap-2 py-4 md:grid-cols-[180px_1fr_auto]">
                <div><p className="eyebrow text-primary">{entry.action}</p><time className="mt-1 block font-mono text-[10px] text-muted-foreground" dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time></div>
                <div><p className="text-sm leading-6">{entry.summary}</p><p className="mt-1 text-xs text-muted-foreground">{entry.releaseTitle}</p></div>
                <p className="font-mono text-[10px] text-muted-foreground md:text-right">By {entry.actor}</p>
              </article>)}
              {historyQuery.data?.length === 0 && <p className="py-6 text-sm text-muted-foreground">No release-state changes have been recorded.</p>}
            </div>}
          </section>
        </>}
    </main>
    <Footer />
  </>;
}
