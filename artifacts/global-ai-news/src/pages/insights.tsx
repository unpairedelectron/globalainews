import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Pencil, Plus, RefreshCw, Search, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { Link } from '@/components/canonical-link';
import { authors, getEditorialWordCountBounds, getReleaseDraftWordCount, type EditorialSection, type Story } from '@/content';
import { BRAND_COLORS } from '@/brand';
import { EditorialSealGlyph } from '@/components/brand-mark';
import { layoutPreviewTitle, socialPreviewAccent, socialPreviewFooterY, socialPreviewHeight, socialPreviewTitleStartY, socialPreviewTitleX, socialPreviewWidth } from '@/social-preview';
import { Footer, Header, SectionLabel, SeoHead, StoryRow } from '@/components/site';
import { useNewsroomSnapshot } from '@/newsroom';
import { ComparisonReviewReminder } from '@/components/comparison-source-review';
import {
  EditorialReleaseHistoryAction,
  getGetNewsroomAutomationRunsQueryKey,
  getGetNewsroomReleaseHistoryQueryKey,
  getGetNewsroomReleasesQueryKey,
  useCancelNewsroomRelease,
  useCreateNewsroomRelease,
  useGetNewsroomAutomationRuns,
  useGetNewsroomReleaseHistory,
  useGetNewsroomReleases,
  useReorderNewsroomReleases,
  useUpdateNewsroomRelease,
  type EditorialRelease,
  type EditorialAutomationRun,
  type EditorialAutomationRunOutcome,
  type EditorialCadence,
  type EditorialReleaseHistoryAction as EditorialReleaseHistoryActionType,
  type EditorialReleaseInput,
  type EditorialReleaseUpdate,
} from '@workspace/api-client-react';

const container = 'editorial-page mx-auto max-w-[1440px] px-5 md:px-10';
const RELEASE_QUEUE_REFRESH_INTERVAL = 5 * 60_000;
function Shell({ children }: { children: ReactNode }) { return <><Header />{children}<Footer /></>; }
function formatScheduleTime(publishAt: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date(publishAt)).replace(',', '') + ' UTC';
}
function formatHistoryTime(createdAt: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date(createdAt)).replace(',', '') + ' UTC';
}
function releaseIsBlocked(release: EditorialRelease): boolean {
  return !release.publishable || release.remainingWords > 0;
}
function releaseStatusLabel(release: EditorialRelease): string {
  return release.status === 'canceled' ? 'canceled' : releaseIsBlocked(release) ? 'blocked' : release.status;
}

type ReleaseFormValue = {
  slug: string;
  title: string;
  dek: string;
  publishAt: string;
  cadence: 'daily' | 'weekly';
  category: string;
  author: string;
  body: string;
  section: EditorialSection;
};

type ReleaseQueueFilter = 'all' | 'blocked';

function releaseBody(release: EditorialRelease): string {
  const story = release.story as Record<string, unknown>;
  if (typeof story.body === 'string') return story.body;
  if (!Array.isArray(story.body)) return '';
  return story.body
    .flatMap((section) => {
      if (!section || typeof section !== 'object') return [];
      const paragraphs = (section as { paragraphs?: unknown }).paragraphs;
      return Array.isArray(paragraphs) ? paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string') : [];
    })
    .join('\n\n');
}

function releaseToForm(release: EditorialRelease): ReleaseFormValue {
  return {
    slug: release.slug,
    title: release.title,
    dek: release.dek,
    publishAt: toDateTimeInput(release.publishAt),
    cadence: release.cadence,
    category: typeof release.story.category === 'string' ? release.story.category : 'Field Notes',
    author: typeof release.story.author === 'string' ? release.story.author : '',
    body: releaseBody(release),
    section: (release.story.section as EditorialSection | undefined) ?? release.section ?? 'Research',
  };
}

function toDateTimeInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function toPublishAt(value: string): string {
  return value ? `${value}:00Z` : '';
}

function defaultReleaseForm(story?: Story): ReleaseFormValue {
  const next = new Date(Date.now() + 24 * 60 * 60 * 1000);
  next.setUTCHours(7, 30, 0, 0);
  return {
    slug: '',
    title: '',
    dek: '',
    publishAt: toDateTimeInput(next.toISOString()),
    cadence: 'daily',
    category: story?.category ?? 'Field Notes',
    author: story?.author ?? '',
    body: story?.body.flatMap((section) => section.paragraphs).join('\n\n') ?? '',
    section: 'Research',
  };
}

function releaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'status' in error && Number((error as { status?: unknown }).status) === 401) {
    return 'Editor sign-in is required to change releases.';
  }
  if (error && typeof error === 'object' && 'error' in error) return String((error as { error: unknown }).error);
  if (error instanceof Error) return error.message;
  return 'The release could not be saved. Check the fields and try again.';
}

function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object' || !('status' in error)) return undefined;
  const status = Number((error as { status?: unknown }).status);
  return Number.isInteger(status) ? status : undefined;
}

function EditorSessionBar({ userLabel, onSignOut }: { userLabel: string; onSignOut: () => void }) {
  return <div data-testid="editor-session" className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-primary/25 bg-primary/5 px-4 py-3 text-sm"><span>Signed in as <strong>{userLabel}</strong></span><button type="button" onClick={onSignOut} className="border-b border-primary pb-1 font-mono text-[10px] uppercase tracking-widest text-primary">Sign out</button></div>;
}

function ReleaseEditor({
  initialValue,
  editing,
  categories,
  onCancel,
  onSubmit,
  saving,
}: {
  initialValue: ReleaseFormValue;
  editing: boolean;
  categories: string[];
  onCancel: () => void;
  onSubmit: (value: ReleaseFormValue) => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const update = (field: keyof ReleaseFormValue, next: string) => setValue((current) => ({ ...current, [field]: next } as ReleaseFormValue));
  const wordCount = getReleaseDraftWordCount(value.dek, value.body);
  const bounds = getEditorialWordCountBounds(value.section);
  const remainingWords = Math.max(0, bounds.minimum - wordCount);
  const overMaximum = bounds.maximum !== undefined && wordCount > bounds.maximum;
  const publishable = remainingWords === 0 && !overMaximum;
  return <form data-testid={editing ? 'form-edit-release' : 'form-create-release'} onSubmit={(event) => { event.preventDefault(); onSubmit(value); }} className="border border-primary/30 bg-surface-muted p-5 md:p-7">
    <div className="flex items-start justify-between gap-5 border-b border-foreground/15 pb-5">
      <div><p className="eyebrow text-primary">{editing ? 'Edit prepared article' : 'New prepared article'}</p><h3 className="mt-2 font-serif text-3xl leading-none">{editing ? 'Keep the handoff precise.' : 'Prepare the next edition.'}</h3></div>
      <button data-testid="button-close-release-editor" type="button" onClick={onCancel} aria-label="Close release editor" className="border border-foreground/20 p-2 hover:border-primary hover:text-primary"><X size={16} /></button>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <label className="md:col-span-2"><span className="eyebrow text-muted-foreground">Headline</span><input data-testid="input-release-title" required maxLength={240} value={value.title} onChange={(event) => update('title', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 font-serif text-2xl outline-none focus:border-primary" /></label>
      {!editing && <label><span className="eyebrow text-muted-foreground">Slug</span><input data-testid="input-release-slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" minLength={2} maxLength={120} value={value.slug} onChange={(event) => update('slug', event.target.value.toLowerCase())} placeholder="a-clear-editorial-slug" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary" /></label>}
      <label className={editing ? 'md:col-span-2' : ''}><span className="eyebrow text-muted-foreground">Standfirst</span><input data-testid="input-release-dek" required maxLength={500} value={value.dek} onChange={(event) => update('dek', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary" /></label>
      <label><span className="eyebrow text-muted-foreground">Release time · UTC</span><input data-testid="input-release-publish-at" required type="datetime-local" value={value.publishAt} onChange={(event) => update('publishAt', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary" /></label>
      <label><span className="eyebrow text-muted-foreground">Cadence</span><select data-testid="select-release-cadence" value={value.cadence} onChange={(event) => update('cadence', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary"><option value="daily">Daily edition</option><option value="weekly">Weekly edition</option></select></label>
       <label><span className="eyebrow text-muted-foreground">Editorial section</span><select data-testid="select-release-section" value={value.section} onChange={(event) => update('section', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary"><option value="Brief">Brief · 120–220 words</option><option value="Research">Research · at least 800 words</option><option value="Data">Data · at least 800 words</option></select></label>
      <label><span className="eyebrow text-muted-foreground">Desk</span><select data-testid="select-release-category" required value={value.category} onChange={(event) => update('category', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary">{categories.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
      <label><span className="eyebrow text-muted-foreground">Author · choose a verified record</span><select data-testid="select-release-author" required value={value.author} onChange={(event) => update('author', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary"><option value="" disabled>Select an author</option>{authors.map((author) => <option value={author.slug} key={author.slug}>{author.name}</option>)}</select></label>
      <label className="md:col-span-2"><span className="eyebrow text-muted-foreground">Working copy</span><textarea data-testid="textarea-release-body" required minLength={1} value={value.body} onChange={(event) => update('body', event.target.value)} rows={7} className="mt-2 w-full resize-y border border-foreground/20 bg-background p-3 text-sm leading-6 outline-none focus:border-primary" /></label>
    </div>
     <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/15 pt-5"><div className="max-w-md text-xs leading-5 text-muted-foreground"><p data-testid="release-word-count" className="font-mono text-primary">{wordCount} / {bounds.minimum}{bounds.maximum ? `–${bounds.maximum}` : '+'} words{overMaximum ? ' · over limit' : remainingWords > 0 ? ` · ${remainingWords} more needed` : ' · length met'}</p>{!publishable ? <p data-testid="release-publish-blocked" className="mt-2 text-destructive">{overMaximum ? `Briefs cannot exceed ${bounds.maximum} words.` : `${value.section} releases need at least ${bounds.minimum} words of visible copy.`}</p> : <p>The article will enter the durable release queue and remain editable until it publishes.</p>}</div><div className="flex gap-2"><button data-testid="button-cancel-release-editor" type="button" onClick={onCancel} className="border border-foreground/20 px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-primary">Discard</button><button data-testid="button-save-release" type="submit" disabled={saving || !publishable} className="inline-flex items-center gap-2 bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : 'Add to queue'}</button></div></div>
  </form>;
}

function AutomationAudit() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const automationUrl = useMemo(() => {
    const pathnameQuery = new URLSearchParams(location.split('?')[1] ?? '');
    return search ? new URLSearchParams(search) : pathnameQuery;
  }, [location, search]);
  const automationOutcome = automationUrl.get('automationOutcome') as EditorialAutomationRunOutcome | null;
  const automationCadence = automationUrl.get('automationCadence') as EditorialCadence | null;
  const outcomeFilter = ['scheduled', 'completed', 'rejected', 'skipped', 'failed', 'running'].includes(automationOutcome ?? '')
    ? automationOutcome ?? undefined
    : undefined;
  const cadenceFilter = ['daily', 'weekly'].includes(automationCadence ?? '')
    ? automationCadence ?? undefined
    : undefined;
  const automationFilters = { outcome: outcomeFilter, cadence: cadenceFilter };
  const runsQuery = useGetNewsroomAutomationRuns({
    outcome: outcomeFilter,
    cadence: cadenceFilter,
  }, {
    query: {
      queryKey: getGetNewsroomAutomationRunsQueryKey(automationFilters),
      staleTime: 60_000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  });
  const runs = runsQuery.data ?? [];
  const filtersActive = Boolean(outcomeFilter || cadenceFilter);
  const filterSummary = [
    outcomeFilter && `outcome “${outcomeFilter}”`,
    cadenceFilter && `cadence “${cadenceFilter}”`,
  ].filter(Boolean).join(' and ');
  const updateAutomationFilter = (key: 'automationOutcome' | 'automationCadence', value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    const nextQuery = params.toString();
    setLocation(`${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}#automation-audit`);
  };
  const clearAutomationFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('automationOutcome');
    params.delete('automationCadence');
    const nextQuery = params.toString();
    setLocation(`${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}#automation-audit`);
  };

  return <section id="automation-audit" data-testid="automation-audit" className="mt-14 border-t border-foreground/15 pt-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <SectionLabel>Autonomous desk</SectionLabel>
        <h3 className="mt-3 font-serif text-4xl leading-none">Why a story moved forward — or stopped.</h3>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Recent drafting and verification runs are shown here without exposing raw provider payloads or credentials.</p>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{filtersActive ? `${runs.length} matching runs` : `Last ${runs.length} runs`}</span>
    </div>
    <div className="mt-7 flex flex-wrap items-end gap-5 border-y border-foreground/15 py-5">
      <label className="min-w-44"><span className="eyebrow text-muted-foreground">Outcome</span><select data-testid="select-automation-outcome" value={outcomeFilter ?? ''} onChange={(event) => updateAutomationFilter('automationOutcome', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary"><option value="">All outcomes</option><option value="scheduled">Scheduled</option><option value="rejected">Rejected</option><option value="failed">Failed</option><option value="skipped">Skipped</option><option value="completed">Completed</option><option value="running">Running</option></select></label>
      <label className="min-w-44"><span className="eyebrow text-muted-foreground">Cadence</span><select data-testid="select-automation-cadence" value={cadenceFilter ?? ''} onChange={(event) => updateAutomationFilter('automationCadence', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-2 text-sm outline-none focus:border-primary"><option value="">All cadences</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select></label>
      {filtersActive && <div data-testid="automation-active-filters" className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><span>Showing runs matching {filterSummary}.</span><button type="button" onClick={clearAutomationFilters} className="border-b border-primary pb-1 font-mono text-[10px] uppercase tracking-widest text-primary">Clear filters</button></div>}
    </div>
    {runsQuery.isLoading && <p className="mt-7 border border-foreground/15 p-5 text-sm text-muted-foreground">Loading autonomous run audits…</p>}
    {runsQuery.isError && <div className="mt-7 border border-destructive/35 p-5"><p className="eyebrow text-destructive">Automation audit unavailable</p><p className="mt-3 text-sm leading-6 text-muted-foreground">The editorial run history could not be read. The publishing queue remains unchanged.</p><button type="button" onClick={() => void runsQuery.refetch()} className="mt-4 border border-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button></div>}
    {!runsQuery.isLoading && !runsQuery.isError && runs.length === 0 && <p data-testid="automation-empty-state" className="mt-7 border border-dashed border-foreground/25 p-5 text-sm text-muted-foreground">{filtersActive ? `No autonomous runs match ${filterSummary}. Clear a filter or try another combination.` : 'No autonomous runs have been recorded yet.'}</p>}
    {runs.length > 0 && <div className="mt-7 grid gap-px border border-foreground/15 bg-foreground/15">{runs.map((run: EditorialAutomationRun) => {
      const rejected = run.outcome === 'rejected';
      const scheduled = run.outcome === 'scheduled';
      const statusClass = rejected || run.outcome === 'failed' ? 'text-destructive' : scheduled ? 'text-primary' : 'text-muted-foreground';
      return <article data-testid={`automation-run-${run.id}`} key={run.id} className="bg-background p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`eyebrow ${statusClass}`}>{scheduled ? 'scheduled release' : run.outcome}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{formatHistoryTime(run.startedAt)} · {run.cadence} · {run.trigger}</p>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">Verification {Math.round(run.verification.score * 100)}%</span>
        </div>
        <h4 className="mt-5 max-w-3xl font-serif text-2xl leading-tight">{run.title ?? 'Draft did not produce a publishable title'}</h4>
        <div className="mt-5 grid gap-5 border-t border-foreground/15 pt-5 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow text-muted-foreground">Quality gate</p>
            {run.qualityGateReasons.length > 0 ? <ul className="mt-3 grid gap-2 text-sm leading-6">{run.qualityGateReasons.map((reason) => <li key={reason} className="flex gap-2"><span className="text-destructive">×</span><span>{reason.replaceAll('_', ' ')}</span></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No quality-gate rejection reasons recorded.</p>}
            {run.verification.unsupportedClaims.length > 0 && <div className="mt-4"><p className="eyebrow text-destructive">Unsupported claims</p><ul className="mt-2 grid gap-2 text-sm leading-6 text-muted-foreground">{run.verification.unsupportedClaims.map((claim) => <li key={claim}>• {claim}</li>)}</ul></div>}
            {run.verification.slopFlags.length > 0 && <div className="mt-4"><p className="eyebrow text-destructive">Slop flags</p><ul className="mt-2 grid gap-2 text-sm leading-6 text-muted-foreground">{run.verification.slopFlags.map((flag) => <li key={flag}>• {flag}</li>)}</ul></div>}
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">Verifier notes</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{run.verification.notes || 'No verifier notes were recorded.'}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Draft {run.draftModel} · Verify {run.verificationModel}</p>
            {scheduled && run.slug && <Link href={`/insights#editorial-queue-${run.slug}`} className="mt-5 inline-flex border-b border-primary pb-1 text-sm text-primary">Open scheduled release <ArrowUpRight size={14} className="ml-2" /></Link>}
          </div>
        </div>
      </article>;
    })}</div>}
  </section>;
}

export type InsightsEditorAuth = {
  isSignedIn?: boolean;
  userId?: string;
  userLabel: string;
  onSignOut: () => void;
};

export function InsightsPage({ editorAuth }: { editorAuth?: InsightsEditorAuth }) {
  const localSmokeHost = window.location.hostname === '127.0.0.1';
  const smokeEditorSession = localSmokeHost
    && new URLSearchParams(window.location.search).get('smoke-editor') === '1';
  const smokeEditorDenied = localSmokeHost
    && new URLSearchParams(window.location.search).get('smoke-editor-denied') === '1';
  const editorSignedIn = smokeEditorSession || smokeEditorDenied || editorAuth?.isSignedIn === true;
  const snapshot = useNewsroomSnapshot();
  const { stories: newsroomStories } = snapshot;
  const [previewSlug, setPreviewSlug] = useState(newsroomStories[0]?.slug ?? '');
  const previewStory = newsroomStories.find((story) => story.slug === previewSlug) ?? newsroomStories[0];
  const releasesQueryKey = useMemo(
    () => [...getGetNewsroomReleasesQueryKey(), editorAuth?.userId ?? 'smoke-session'] as const,
    [editorAuth?.userId],
  );
  const releasesQuery = useGetNewsroomReleases({ query: { queryKey: releasesQueryKey, enabled: editorSignedIn && !smokeEditorDenied, staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true, refetchInterval: RELEASE_QUEUE_REFRESH_INTERVAL, refetchIntervalInBackground: false, retry: 1 } });
  const editorAccessError = smokeEditorDenied ? { status: 403 } : releasesQuery.error;
  const editorAccessDenied = editorSignedIn && getHttpStatus(editorAccessError) === 403;
  const editorSessionActive = smokeEditorSession || (
    editorAuth?.isSignedIn === true && releasesQuery.isSuccess && !editorAccessDenied
  );
  const editorAccessCheckFailed = editorSignedIn
    && !editorAccessDenied
    && !editorSessionActive
    && releasesQuery.isError;
  const editorAccessCheckPending = editorSignedIn
    && !editorAccessDenied
    && !editorSessionActive
    && !editorAccessCheckFailed;
  const [location, setLocation] = useLocation();
  const historySearch = useSearch();
  const historyUrl = useMemo(() => {
    const pathnameQuery = new URLSearchParams(location.split('?')[1] ?? '');
    return historySearch ? new URLSearchParams(historySearch) : pathnameQuery;
  }, [historySearch, location]);
  const releaseFilter: ReleaseQueueFilter = historyUrl.get('releaseFilter') === 'blocked' ? 'blocked' : 'all';
  const historyReleaseSlug = historyUrl.get('releaseSlug') ?? '';
  const historyAction = (historyUrl.get('action') ?? '') as EditorialReleaseHistoryActionType | '';
  const historyActor = historyUrl.get('actor') ?? '';
  const historyFilters = {
    releaseSlug: historyReleaseSlug || undefined,
    action: historyAction || undefined,
    actor: historyActor.trim() || undefined,
  };
  const historyQuery = useGetNewsroomReleaseHistory(historyFilters, { query: { queryKey: getGetNewsroomReleaseHistoryQueryKey(historyFilters), enabled: editorSessionActive, staleTime: 0, refetchOnMount: true, retry: 1 } });
  const createRelease = useCreateNewsroomRelease();
  const updateRelease = useUpdateNewsroomRelease();
  const cancelRelease = useCancelNewsroomRelease();
  const reorderReleases = useReorderNewsroomReleases();
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<{ release?: EditorialRelease; value: ReleaseFormValue } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const queue = releasesQuery.data ?? [];
  const orderedQueue = [...queue].sort((a, b) => a.position - b.position);
  const blockedQueue = orderedQueue.filter((release) => release.status !== 'canceled' && releaseIsBlocked(release));
  const visibleQueue = releaseFilter === 'blocked' ? blockedQueue : orderedQueue;
  const scheduled = orderedQueue.filter((release) => release.status === 'scheduled' || (release.status !== 'canceled' && releaseIsBlocked(release)));
  const categories = Array.from(new Set(newsroomStories.map((story) => story.category)));
  const historyReleaseOptions = Array.from(new Set(orderedQueue.map((release) => release.slug)));
  const historyFilterActive = Boolean(historyReleaseSlug || historyAction || historyActor.trim());
   const historyFilterSummary = [
     historyReleaseSlug && `release “${historyReleaseSlug === 'queue' ? 'Queue-level changes' : queue.find((release) => release.slug === historyReleaseSlug)?.title ?? historyReleaseSlug}”`,
     historyAction && `change type “${historyAction}”`,
     historyActor.trim() && `actor “${historyActor.trim()}”`,
   ].filter(Boolean).join(', ');
   const historyEmptyMessage = historyFilterActive
     ? `No matching release change was found for ${historyFilterSummary}. Clear a filter or try different values.`
     : 'No release changes have been recorded yet.';
  const snapshotMetrics = [
    { value: newsroomStories.length, label: 'Published stories' },
    { value: snapshot.entities.length, label: 'Connected entities' },
    { value: snapshot.researchRecords.filter((record) => record.status === 'published').length, label: 'Published research records' },
    { value: snapshot.dataProducts.filter((product) => product.status === 'published').length, label: 'Published data products' },
  ];
  const updateHistoryFilter = (key: 'releaseSlug' | 'action' | 'actor', value: string) => {
    const params = new URLSearchParams(window.location.search);
    const normalizedValue = key === 'actor' ? value.trim() : value;
    if (normalizedValue) params.set(key, normalizedValue);
    else params.delete(key);
    const query = params.toString();
    setLocation(`${location.split('?')[0] || '/insights'}${query ? `?${query}` : ''}`, { replace: true });
  };
  const clearHistoryFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('releaseSlug');
    params.delete('action');
    params.delete('actor');
    const query = params.toString();
    setLocation(`${location.split('?')[0] || '/insights'}${query ? `?${query}` : ''}`, { replace: true });
  };
  const updateReleaseFilter = (nextFilter: ReleaseQueueFilter) => {
    const params = new URLSearchParams(window.location.search);
    if (nextFilter === 'blocked') params.set('releaseFilter', nextFilter);
    else params.delete('releaseFilter');
    const query = params.toString();
    setLocation(`${location.split('?')[0] || '/insights'}${query ? `?${query}` : ''}`, { replace: true });
  };
  const syncQueue = (next: EditorialRelease[]) => {
    const sorted = [...next].sort((a, b) => a.position - b.position);
    queryClient.setQueryData(releasesQueryKey, sorted);
    void releasesQuery.refetch();
    void historyQuery.refetch();
  };
  const openCreate = () => {
    setActionError(null);
    setEditor({ value: defaultReleaseForm(newsroomStories[0]) });
  };
  const openEdit = (release: EditorialRelease) => {
    setActionError(null);
    setEditor({ release, value: releaseToForm(release) });
  };
  const saveRelease = async (value: ReleaseFormValue) => {
    setActionError(null);
    setBusy(editor?.release ? `save-${editor.release.slug}` : 'create');
    try {
      if (editor?.release) {
        const data: EditorialReleaseUpdate = { title: value.title, dek: value.dek, publishAt: toPublishAt(value.publishAt), cadence: value.cadence, category: value.category, author: value.author, body: value.body, section: value.section };
        const updated = await updateRelease.mutateAsync({ slug: editor.release.slug, data });
        syncQueue(queue.map((release) => release.slug === updated.slug ? updated : release));
      } else {
        const data: EditorialReleaseInput = { slug: value.slug, title: value.title, dek: value.dek, publishAt: toPublishAt(value.publishAt), cadence: value.cadence, category: value.category, author: value.author, body: value.body, section: value.section };
        const created = await createRelease.mutateAsync({ data });
        syncQueue([...queue, created]);
      }
      setEditor(null);
    } catch (error) {
      setActionError(releaseError(error));
    } finally {
      setBusy(null);
    }
  };
  const cancelPrepared = async (release: EditorialRelease) => {
    if (!window.confirm(`Cancel “${release.title}”? This removes it from the prepared queue.`)) return;
    setActionError(null);
    setBusy(`cancel-${release.slug}`);
    try {
      const canceled = await cancelRelease.mutateAsync({ slug: release.slug });
      syncQueue(queue.map((item) => item.slug === canceled.slug ? canceled : item));
    } catch (error) {
      setActionError(releaseError(error));
    } finally {
      setBusy(null);
    }
  };
  const moveRelease = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= scheduled.length) return;
    const slugs = scheduled.map((release) => release.slug);
    [slugs[index], slugs[target]] = [slugs[target], slugs[index]];
    setActionError(null);
    setBusy('reorder');
    try {
      const reordered = await reorderReleases.mutateAsync({ data: { slugs } });
      syncQueue(reordered);
    } catch (error) {
      setActionError(releaseError(error));
    } finally {
      setBusy(null);
    }
  };
  return <Shell><SeoHead title="Publisher workspace — Global AI News" description="Internal editorial intelligence workspace." path="/insights" /><main className={container}>
    <section className="border-b border-foreground/20 py-14 md:py-20"><p className="eyebrow text-primary">Internal editorial surface</p><h1 className="mt-6 max-w-5xl font-serif text-7xl leading-[.84] md:text-[9rem]">The room<br /><em className="text-primary">is reading.</em></h1><p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">Review the maintained public snapshot, prepared releases and editorial changes. Counts below come from the current published newsroom records, not audience estimates.</p></section>
    <section aria-label="Current published newsroom records" className="grid gap-px border-x border-b border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">{snapshotMetrics.map(({ value, label }) => <div data-testid={`metric-${label.toLowerCase().replace(/\s/g, '-')}`} key={label} className="bg-background p-6"><p className="eyebrow text-muted-foreground">{label}</p><p className="mt-7 font-serif text-4xl">{value}</p><p className="mt-2 text-xs text-muted-foreground">Current public snapshot</p></div>)}</section>
      {!editorSignedIn && <section data-testid="editor-signed-out-state" className="border-b border-foreground/20 py-10"><div className="border border-primary/25 bg-primary/5 p-6 md:flex md:items-center md:justify-between md:gap-8"><div><p className="eyebrow text-primary">Editor access</p><h2 className="mt-3 font-serif text-3xl leading-none">Sign in before changing the release desk.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Public stories stay open to every reader. Release creation, sequencing, edits and cancellations require an authenticated editor session.</p></div><Link href="/sign-in" className="mt-6 inline-flex shrink-0 items-center gap-2 bg-foreground px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-background md:mt-0">Sign in as editor <ArrowUpRight size={14} /></Link></div></section>}
      {editorAccessDenied && <section data-testid="editor-access-denied-state" className="border-b border-foreground/20 py-10"><div className="border border-destructive/35 bg-destructive/5 p-6 md:flex md:items-center md:justify-between md:gap-8"><div><p className="eyebrow text-destructive">Restricted editor access</p><h2 className="mt-3 font-serif text-3xl leading-none">This account is not approved to edit releases.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">The release desk is limited to the approved editor account with a verified primary email. Your account is still signed in, but editor controls are unavailable.</p></div><div className="mt-6 flex shrink-0 flex-wrap items-center gap-4 md:mt-0"><button type="button" onClick={editorAuth?.onSignOut} className="border-b border-primary pb-1 font-mono text-[10px] uppercase tracking-widest text-primary">Sign out</button><Link href="/" className="inline-flex min-h-11 items-center bg-foreground px-4 font-mono text-[10px] uppercase tracking-widest text-background">Return to newsroom</Link></div></div></section>}
      {editorAccessCheckPending && <p data-testid="editor-access-check" role="status" className="border-b border-foreground/20 py-8 text-sm text-muted-foreground">Checking editor access…</p>}
      {editorAccessCheckFailed && <div data-testid="editor-access-check-error" role="alert" className="border-b border-foreground/20 py-8"><p className="text-sm text-destructive">We could not verify editor access right now. The release desk remains unavailable.</p><button type="button" onClick={() => void releasesQuery.refetch()} className="mt-4 border-b border-primary pb-1 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button></div>}
     {editorSessionActive && <><EditorSessionBar userLabel={editorAuth?.userLabel ?? 'Signed-in editor'} onSignOut={editorAuth?.onSignOut ?? (() => undefined)} /><ComparisonReviewReminder /><section data-testid="editorial-queue" className="border-b border-foreground/20 py-14">
       <div className="flex flex-wrap items-end justify-between gap-5"><div><SectionLabel>Durable release desk</SectionLabel><h2 className="mt-3 max-w-xl font-serif text-5xl leading-[.9]">Prepare the next edition.</h2><p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">Create, sequence and reschedule prepared articles without changing the publication build.</p></div><div className="flex flex-wrap items-center justify-end gap-2"><span data-testid="release-queue-refresh-status" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{releasesQuery.isFetching ? 'Updating readiness…' : 'Queue refreshes every five minutes'}</span><button data-testid="button-refresh-releases" type="button" onClick={() => { void releasesQuery.refetch(); void historyQuery.refetch(); }} className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary"><RefreshCw size={13} />Refresh</button><button data-testid="button-new-release" type="button" onClick={openCreate} className="inline-flex items-center gap-2 bg-foreground px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-background"><Plus size={14} />New release</button></div></div>
      {editor && <div className="mt-8"><ReleaseEditor key={editor.release?.slug ?? 'new-release'} initialValue={editor.value} editing={Boolean(editor.release)} categories={Array.from(new Set([...categories, editor.value.category]))} onCancel={() => setEditor(null)} onSubmit={saveRelease} saving={busy === 'create' || Boolean(editor.release && busy === `save-${editor.release.slug}`)} /></div>}
      {actionError && <div role="alert" className="mt-5 flex items-center justify-between gap-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm"><span>{actionError}</span><button type="button" onClick={() => setActionError(null)} aria-label="Dismiss release error"><X size={15} /></button></div>}
      {releasesQuery.isLoading && <div className="mt-8 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-48 animate-pulse bg-background/70 p-6"><div className="h-3 w-20 bg-foreground/10" /><div className="mt-8 h-8 w-4/5 bg-foreground/10" /><div className="mt-8 h-3 w-2/5 bg-foreground/10" /></div>)}</div>}
       {releasesQuery.isError && !releasesQuery.data && <div className="mt-8 border border-destructive/35 p-6"><p className="eyebrow text-destructive">Release queue unavailable</p><p className="mt-3 text-sm text-muted-foreground">The editor-managed queue could not be read.</p><button type="button" onClick={() => void releasesQuery.refetch()} className="mt-5 border border-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button></div>}
       {releasesQuery.isError && releasesQuery.data && <div data-testid="release-queue-refresh-error" role="alert" className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-destructive/35 bg-destructive/5 px-4 py-3 text-sm"><span><strong className="font-medium text-destructive">Readiness refresh failed.</strong> Showing the last known queue state.</span><button type="button" onClick={() => void releasesQuery.refetch()} className="border-b border-primary px-1 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button></div>}
        {!releasesQuery.isLoading && releasesQuery.data && <div data-testid="release-queue-filters" className="mt-8 flex flex-wrap items-center gap-2 border-y border-foreground/15 py-4"><span className="eyebrow mr-2 text-muted-foreground">Show</span><button data-testid="button-filter-releases-all" type="button" aria-pressed={releaseFilter === 'all'} onClick={() => updateReleaseFilter('all')} className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${releaseFilter === 'all' ? 'border-foreground bg-foreground text-background' : 'border-foreground/20 hover:border-primary hover:text-primary'}`}>All releases <span className="ml-1 opacity-70">({orderedQueue.length})</span></button><button data-testid="button-filter-releases-blocked" type="button" aria-pressed={releaseFilter === 'blocked'} onClick={() => updateReleaseFilter('blocked')} className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${releaseFilter === 'blocked' ? 'border-foreground bg-foreground text-background' : 'border-foreground/20 hover:border-primary hover:text-primary'}`}>Blocked copy <span className="ml-1 opacity-70">({blockedQueue.length})</span></button></div>}
        {!releasesQuery.isLoading && releasesQuery.data && visibleQueue.length === 0 && <div data-testid="release-queue-empty-state" className="mt-8 border border-dashed border-foreground/25 p-8"><p className="eyebrow text-primary">{releaseFilter === 'blocked' ? 'No blocked releases' : 'No prepared releases'}</p><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{releaseFilter === 'blocked' ? orderedQueue.length > 0 ? 'Every prepared release currently meets the minimum copy requirement.' : 'The queue is clear. Add a prepared article to give the next edition a durable place in the publishing calendar.' : 'The queue is clear. Add a prepared article to give the next edition a durable place in the publishing calendar.'}</p><button type="button" onClick={openCreate} className="mt-6 inline-flex items-center gap-2 border-b border-primary pb-2 text-sm text-primary"><Plus size={14} />Prepare an article</button></div>}
       {visibleQueue.length > 0 && <div data-testid="release-queue-cards" className="mt-8 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-2 xl:grid-cols-3">{visibleQueue.map((release) => { const bounds = getEditorialWordCountBounds(release.section); const overMaximum = bounds.maximum !== undefined && release.wordCount > bounds.maximum; const activeIndex = scheduled.findIndex((item) => item.slug === release.slug); const blocked = releaseIsBlocked(release); const isScheduled = release.status !== 'canceled' && (release.status === 'scheduled' || blocked); const statusLabel = releaseStatusLabel(release); const rangeLabel = bounds.maximum ? `${bounds.minimum}–${bounds.maximum}` : `${bounds.minimum}+`; const blockedLabel = overMaximum ? `Blocked · reduce to ${bounds.maximum} words or fewer.` : `Blocked · ${release.remainingWords} more ${release.remainingWords === 1 ? 'word' : 'words'} needed before publishing.`; return <article id={`editorial-queue-${release.slug}`} data-testid={`editorial-queue-${release.slug}`} key={release.slug} className="bg-background p-6"><div className="flex items-center justify-between gap-4"><p data-testid={`release-status-${release.slug}`} className={`eyebrow ${blocked || release.status === 'canceled' ? 'text-destructive' : release.status === 'published' ? 'text-primary' : 'text-muted-foreground'}`}>{statusLabel}</p><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{release.cadence}</span></div><h3 className="mt-7 font-serif text-2xl leading-[.95]">{release.title}</h3><p className="mt-4 text-sm leading-5 text-muted-foreground">{release.dek}</p><div data-testid={`release-readiness-${release.slug}`} className={`mt-5 border-t border-foreground/15 pt-4 text-xs ${blocked ? 'text-destructive' : 'text-muted-foreground'}`}><p className="font-mono">{release.wordCount} / {rangeLabel} words · {release.remainingWords} remaining</p><p className="mt-1">{blocked ? blockedLabel : 'Length met · ready for publication.'}</p></div><p className="mt-4 text-xs text-muted-foreground">Release {formatScheduleTime(release.publishAt)}</p>{isScheduled && <div className="mt-5 flex flex-wrap items-center gap-2"><button data-testid={`button-move-release-up-${release.slug}`} type="button" disabled={activeIndex <= 0 || busy === 'reorder'} onClick={() => void moveRelease(activeIndex, -1)} className="inline-flex items-center gap-1 border border-foreground/20 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-primary disabled:opacity-30"><ArrowUp size={12} />Earlier</button><button data-testid={`button-move-release-down-${release.slug}`} type="button" disabled={activeIndex < 0 || activeIndex === scheduled.length - 1 || busy === 'reorder'} onClick={() => void moveRelease(activeIndex, 1)} className="inline-flex items-center gap-1 border border-foreground/20 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-primary disabled:opacity-30"><ArrowDown size={12} />Later</button><button data-testid={`button-edit-release-${release.slug}`} type="button" onClick={() => openEdit(release)} className="inline-flex items-center gap-1 border border-foreground/20 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary"><Pencil size={12} />Edit</button><button data-testid={`button-cancel-release-${release.slug}`} type="button" disabled={busy === `cancel-${release.slug}`} onClick={() => void cancelPrepared(release)} className="border-b border-destructive/50 px-1 py-1.5 font-mono text-[10px] uppercase tracking-widest text-destructive hover:border-destructive disabled:opacity-40">Cancel</button></div>}</article>; })}</div>}
      <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">Prepared stories move into the live newsroom automatically at their scheduled time. Published and canceled records stay visible as an editorial trail.</p>
         {editorSessionActive && <AutomationAudit />}
        <div data-testid="release-history" className="mt-14 border-t border-foreground/15 pt-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><SectionLabel>Release history</SectionLabel><h3 className="mt-3 font-serif text-4xl leading-none">Recent changes.</h3><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">A durable record of who changed the queue, what changed and when.</p></div><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Last 50 events</span></div><div className="mt-7 grid gap-3 border-y border-foreground/15 py-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"><label className="block"><span className="eyebrow text-muted-foreground">Release</span><select data-testid="select-release-history-release" value={historyReleaseSlug} onChange={(event) => updateHistoryFilter('releaseSlug', event.target.value)} className="mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm"><option value="">All releases</option>{historyReleaseOptions.map((slug) => <option value={slug} key={slug}>{queue.find((release) => release.slug === slug)?.title ?? slug}</option>)}<option value="queue">Queue-level changes</option></select></label><label className="block"><span className="eyebrow text-muted-foreground">Change type</span><select data-testid="select-release-history-action" value={historyAction} onChange={(event) => updateHistoryFilter('action', event.target.value)} className="mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm"><option value="">All change types</option>{Object.values(EditorialReleaseHistoryAction).map((action) => <option value={action} key={action}>{action}</option>)}</select></label><label className="block"><span className="eyebrow text-muted-foreground">Actor</span><input data-testid="input-release-history-actor" type="search" value={historyActor} onChange={(event) => updateHistoryFilter('actor', event.target.value)} placeholder="Search editor identity" className="mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm" /></label>{historyFilterActive && <button data-testid="button-clear-release-history-filters" type="button" onClick={clearHistoryFilters} className="border-b border-primary px-1 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Clear filters</button>}</div>{historyQuery.isLoading && <p className="mt-7 border border-foreground/15 p-5 text-sm text-muted-foreground">Loading release history…</p>}{historyQuery.isError && <div data-testid="release-history-error" className="mt-7 border border-destructive/35 p-5"><p className="eyebrow text-destructive">History unavailable</p><p data-testid="release-history-error-message" className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">The release history service is temporarily unavailable. Try again when the API is reachable.</p><button data-testid="button-retry-release-history" type="button" onClick={() => void historyQuery.refetch()} className="mt-4 border border-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button></div>}{!historyQuery.isLoading && !historyQuery.isError && (historyQuery.data?.length ?? 0) === 0 && <p className="mt-7 break-words border border-dashed border-foreground/25 p-5 text-sm text-muted-foreground">{historyEmptyMessage}</p>}{(historyQuery.data?.length ?? 0) > 0 && <div className="mt-7 divide-y divide-foreground/15 border-y border-foreground/15">{historyQuery.data?.map((entry) => <article data-testid={`release-history-${entry.id}`} key={entry.id} className="grid gap-3 py-5 md:grid-cols-[150px_1fr_auto] md:items-start"><div><p className="eyebrow text-primary">{entry.action}</p><p className="mt-2 font-mono text-[10px] text-muted-foreground">{formatHistoryTime(entry.createdAt)}</p></div><div><p className="text-sm leading-6">{entry.summary}</p><p className="mt-2 text-xs text-muted-foreground">{entry.releaseTitle}</p></div><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:text-right">By {entry.actor}</p></article>)}</div>}</div>
     </section></>}
    <section className="border-b border-foreground/20 py-14"><div className="grid gap-10 md:grid-cols-[.65fr_1.35fr] md:items-start"><div><SectionLabel>Share card preview</SectionLabel><h2 className="mt-3 max-w-md font-serif text-5xl leading-[.9]">See the headline before it travels.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">This 1200 × 630 treatment is the same layout used for published social cards. Select a story to inspect the fallback size and exact line breaks.</p>{previewStory && <label className="mt-7 block max-w-sm"><span className="eyebrow text-muted-foreground">Article</span><select data-testid="select-social-preview-story" value={previewStory.slug} onChange={(event) => setPreviewSlug(event.target.value)} className="mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm">{newsroomStories.map((story) => <option value={story.slug} key={story.slug}>{story.title}</option>)}</select></label>}</div><div>{previewStory ? <SocialPreviewCard story={previewStory} /> : <p className="border border-foreground/15 p-6 text-sm text-muted-foreground">No published stories are available for preview.</p>}</div></div></section>
    <section className="grid gap-12 py-14 md:grid-cols-[1.1fr_.9fr]"><div><SectionLabel>Publishing calendar</SectionLabel>{['The model race after the benchmark era', 'India builds in public', 'The cost of intelligence', 'Proof, not demos'].map((title, index) => <div key={title} className="flex items-start justify-between border-t border-foreground/15 py-5"><div><p className="eyebrow text-primary">0{index + 1} · planned</p><p className="mt-2 font-serif text-2xl">{title}</p></div><span className="font-mono text-xs text-muted-foreground">{['OCT', 'NOV', 'DEC', 'JAN'][index]}</span></div>)}</div><div><SectionLabel>Live stories</SectionLabel>{newsroomStories.slice(0, 4).map((story, index) => <StoryRow key={story.slug} slug={story.slug} rank={index + 1} compact />)}</div></section>
    </main></Shell>;
}

function SocialPreviewCard({ story }: { story: Story }) {
  const title = `${story.title} — Global AI News`;
  const route = `/article/${story.slug}`;
  const layout = layoutPreviewTitle(title, route);
  const accent = socialPreviewAccent(story.slug);
  const titleId = `social-preview-title-${story.slug}`;
  const descriptionId = `social-preview-description-${story.slug}`;
  const isScaled = layout.fontSize < 54;

  return <div data-testid="social-preview-card" className="border border-foreground/15 bg-surface-muted">
    <div className="aspect-[1200/630] w-full">
      <svg className="block h-full w-full" viewBox={`0 0 ${socialPreviewWidth} ${socialPreviewHeight}`} role="img" aria-label={`Global AI News social preview for ${title}`} aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>{title}</title>
        <desc id={descriptionId}>Global AI News editorial preview for {title}</desc>
        <rect width={socialPreviewWidth} height={socialPreviewHeight} fill="#f4f1ea" />
        <circle cx="1000" cy="150" r="184" fill="none" stroke={accent} strokeWidth="2" />
        <circle cx="1000" cy="150" r="122" fill="none" stroke={accent} strokeOpacity=".42" strokeWidth="2" />
        <path d="M80 520H1120" stroke={accent} strokeWidth="3" />
        <path d="M80 532H420" stroke="#101820" strokeOpacity=".24" />
        <EditorialSealGlyph x={80} y={48} size={44} />
        <text x={142} y="80" fill={BRAND_COLORS.ink} fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="700" letterSpacing="2.5">GLOBAL <tspan fill={BRAND_COLORS.blue}>AI</tspan> NEWS</text>
        <text x={socialPreviewTitleX} y="142" fill="#56616b" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" letterSpacing="1.5">{story.category.toUpperCase()} / FIELD NOTE</text>
        {layout.lines.map((line, index) => <text key={line} x={socialPreviewTitleX} y={socialPreviewTitleStartY + index * layout.lineHeight} fill="#101820" fontFamily="Georgia, 'Times New Roman', serif" fontSize={layout.fontSize} fontWeight="700">{line}</text>)}
        <text x={socialPreviewTitleX} y={socialPreviewFooterY} fill="#56616b" fontFamily="Arial, Helvetica, sans-serif" fontSize="18">globalainews.in</text>
      </svg>
    </div>
    <div className="grid gap-5 border-t border-foreground/15 bg-background px-5 py-4 text-xs sm:grid-cols-[auto_1fr]">
      <div>
        <p className="eyebrow text-muted-foreground">Card format</p>
        <p data-testid="social-preview-dimensions" className="mt-2 font-mono text-primary">1200 × 630 PNG</p>
      </div>
      <div>
        <p className="eyebrow text-muted-foreground">Headline treatment</p>
        <p data-testid="social-preview-scale-status" className="mt-2 font-mono text-primary">{isScaled ? `Scaled to ${layout.fontSize}px` : 'Default 54px'} · {layout.lines.length} lines</p>
        <div data-testid="social-preview-line-breaks" className="mt-3 flex flex-wrap gap-2" aria-label="Headline line breaks">
          {layout.lines.map((line, index) => <span data-testid={`social-preview-line-${index + 1}`} key={`${index}-${line}`} className="border border-foreground/15 bg-surface-muted px-2 py-1 font-mono text-[10px]">{line}</span>)}
        </div>
      </div>
    </div>
  </div>;
}

