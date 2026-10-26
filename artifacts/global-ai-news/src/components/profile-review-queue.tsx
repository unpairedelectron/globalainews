import { useState, type FormEvent } from 'react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetNewsroomContentQueryKey,
  getGetNewsroomProfileReviewsQueryKey,
  useGetNewsroomProfileReviews,
  useUpdateNewsroomProfileReview,
  type ProfileReviewQueueItem,
} from '@workspace/api-client-react';
import { Link } from '@/components/canonical-link';
import { formatEditorialDate } from '@/editorial-date';

const PROFILE_REVIEW_QUEUE_REFRESH_INTERVAL = 5 * 60_000;

function reasonLabel(profile: ProfileReviewQueueItem): string {
  if (profile.reason === 'linked-update') return 'A linked timeline entry is newer than this review.';
  if (profile.reason === 'interval') {
    if (profile.daysUntilDue !== null && profile.daysUntilDue < 0) {
      return `The 90-day review is ${Math.abs(profile.daysUntilDue)} days overdue.`;
    }
    return 'The 90-day editorial review is due.';
  }
  if (profile.reason === 'invalid-date') return 'The review date is missing or invalid.';
  return `The 90-day editorial review is due in ${profile.daysUntilDue ?? 0} days.`;
}

export function ProfileReviewQueue({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const [reviewDates, setReviewDates] = useState<Record<string, string>>({});
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const queueQuery = useGetNewsroomProfileReviews({
    query: {
      queryKey: getGetNewsroomProfileReviewsQueryKey(),
      enabled,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: PROFILE_REVIEW_QUEUE_REFRESH_INTERVAL,
      refetchIntervalInBackground: false,
      retry: 1,
    },
  });
  const updateReview = useUpdateNewsroomProfileReview();
  const profiles = queueQuery.data?.profiles ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const recordReview = async (event: FormEvent<HTMLFormElement>, profile: ProfileReviewQueueItem) => {
    event.preventDefault();
    const reviewedAt = reviewDates[profile.slug] ?? '';
    if (!reviewedAt) {
      setError('Choose the date you reviewed this profile before saving.');
      return;
    }
    setBusySlug(profile.slug);
    setError(null);
    setNotice(null);
    try {
      await updateReview.mutateAsync({ slug: profile.slug, data: { reviewedAt } });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetNewsroomProfileReviewsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetNewsroomContentQueryKey() }),
      ]);
      setReviewDates((current) => ({ ...current, [profile.slug]: '' }));
      setNotice(`${profile.name} review date saved.`);
    } catch {
      setError('The profile review date could not be saved. Try again when the newsroom API is available.');
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <section
      data-testid="profile-review-queue"
      aria-labelledby="profile-review-queue-title"
      className="border-b border-primary/30 bg-primary/5 py-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow text-primary">Editorial review queue</p>
          <h2 id="profile-review-queue-title" className="mt-2 font-serif text-3xl">
            Intelligence profiles to recheck.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Profiles appear when a linked timeline entry is newer than their review, the 90-day
            review is due, or it is due within 21 days. Record the date you actually reviewed each
            profile; the date is never filled in automatically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {queueQuery.isFetching ? 'Updating queue…' : `${profiles.length} ${profiles.length === 1 ? 'profile' : 'profiles'}`}
          </span>
          <button
            data-testid="button-refresh-profile-reviews"
            type="button"
            onClick={() => void queueQuery.refetch()}
            disabled={queueQuery.isFetching}
            className="inline-flex min-h-10 items-center gap-2 border border-foreground/20 px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <RefreshCw size={13} aria-hidden="true" /> Refresh
          </button>
        </div>
      </div>

      {error && <p role="alert" className="mt-5 border border-destructive/35 p-3 text-sm text-destructive">{error}</p>}
      {notice && <p role="status" className="mt-5 border border-primary/25 p-3 text-sm text-primary">{notice}</p>}
      {queueQuery.isLoading && <p role="status" className="mt-6 border border-foreground/15 p-5 text-sm text-muted-foreground">Loading profiles due for review…</p>}
      {queueQuery.isError && (
        <div role="alert" className="mt-6 border border-destructive/35 p-5">
          <p className="eyebrow text-destructive">Profile review queue unavailable</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">The editor queue could not be loaded. No profile dates were changed.</p>
          <button type="button" onClick={() => void queueQuery.refetch()} className="mt-4 border border-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary">Try again</button>
        </div>
      )}
      {!queueQuery.isLoading && !queueQuery.isError && profiles.length === 0 && (
        <p data-testid="profile-review-queue-empty" className="mt-6 border border-dashed border-foreground/25 p-6 text-sm text-muted-foreground">
          No intelligence profiles are due for review in the next 21 days.
        </p>
      )}
      {profiles.length > 0 && (
        <div className="mt-6 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-2">
          {profiles.map((profile) => (
            <article
              key={profile.slug}
              data-testid={`profile-review-${profile.slug}`}
              className="bg-background p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl">{profile.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last reviewed {profile.reviewedAt ? formatEditorialDate(profile.reviewedAt) : 'date missing'}
                    {profile.dueAt ? ` · next review ${formatEditorialDate(profile.dueAt)}` : ''}
                  </p>
                </div>
                <Link href={profile.url} className="inline-flex items-center gap-1 border-b border-primary/40 pb-1 text-sm text-primary hover:border-primary">
                  Open profile <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-4 border-l-2 border-primary pl-3 text-sm leading-6">{reasonLabel(profile)}</p>

              {profile.newerTimelineEvents.length > 0 && (
                <div className="mt-5">
                  <h4 className="eyebrow text-muted-foreground">Newer linked timeline entries</h4>
                  <ul className="mt-2 divide-y divide-foreground/10">
                    {profile.newerTimelineEvents.map((item) => (
                      <li key={item.slug} className="py-3">
                        <Link href={item.url} className="font-medium hover:text-primary">
                          {item.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">{formatEditorialDate(item.date)}</p>
                        {item.references.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            {item.references.map((reference) => (
                              <li key={reference.url}>
                                <a href={reference.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline decoration-primary/40 underline-offset-2">
                                  {reference.label} <ArrowUpRight size={11} className="inline" aria-hidden="true" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 border-t border-foreground/15 pt-4">
                <h4 className="eyebrow text-muted-foreground">Primary profile references</h4>
                {profile.primaryReferences.length > 0 ? (
                  <ul className="mt-2 grid gap-2">
                    {profile.primaryReferences.map((reference) => (
                      <li key={reference.url}>
                        <a href={reference.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline decoration-primary/40 underline-offset-2">
                          {reference.label} <ArrowUpRight size={12} className="inline" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-2 text-sm text-muted-foreground">No primary references are attached to this profile.</p>}
              </div>

              <form className="mt-5 flex flex-wrap items-end gap-3 border-t border-foreground/15 pt-4" onSubmit={(event) => void recordReview(event, profile)}>
                <label className="min-w-[180px] flex-1">
                  <span className="eyebrow text-muted-foreground">Updated review date</span>
                  <input
                    data-testid={`input-profile-review-date-${profile.slug}`}
                    type="date"
                    name="reviewedAt"
                    required
                    max={today}
                    value={reviewDates[profile.slug] ?? ''}
                    onChange={(event) => setReviewDates((current) => ({ ...current, [profile.slug]: event.target.value }))}
                    className="mt-2 min-h-11 w-full border border-foreground/20 bg-background px-3 text-sm"
                  />
                </label>
                <button
                  data-testid={`button-save-profile-review-${profile.slug}`}
                  type="submit"
                  disabled={busySlug !== null}
                  className="min-h-11 bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background disabled:opacity-50"
                >
                  {busySlug === profile.slug ? 'Saving…' : 'Record review'}
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
