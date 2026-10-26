import React from 'react';
import { useEffect, useState } from 'react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import {
  comparisonReports,
  type ComparisonReportSlug,
} from './comparison-reports';

const apiBase = `${import.meta.env?.BASE_URL?.replace(/\/$/, '') ?? ''}/api`;
const trackedReports: ComparisonReportSlug[] = [
  'ai-assistants-compared',
  'ai-image-tools-compared',
];

export interface ComparisonReviewDate {
  reportSlug: ComparisonReportSlug;
  checkedOn: string;
  nextDue: string;
}

function fallbackReviewDates(): ComparisonReviewDate[] {
  return trackedReports.map((reportSlug) => ({
    reportSlug,
    checkedOn: comparisonReports[reportSlug].sourcesReviewedOn,
    nextDue: comparisonReports[reportSlug].nextSourceReviewDue,
  }));
}

async function readReviewDates(): Promise<ComparisonReviewDate[]> {
  const response = await fetch(`${apiBase}/newsroom/comparison-reviews`, {
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Review dates could not be loaded.');
  const result = (await response.json()) as { reports?: ComparisonReviewDate[] };
  if (!Array.isArray(result.reports)) throw new Error('Review dates response was invalid.');
  const savedBySlug = new Map(result.reports.map((review) => [review.reportSlug, review]));
  return fallbackReviewDates().map((fallback) => savedBySlug.get(fallback.reportSlug) ?? fallback);
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

function daysUntil(date: string): number {
  const due = Date.parse(`${date}T00:00:00Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return Math.ceil((due - today.getTime()) / 86_400_000);
}

export function ComparisonReportReviewDates({ reportSlug }: { reportSlug: ComparisonReportSlug }) {
  const [reviewDates, setReviewDates] = useState(fallbackReviewDates);

  useEffect(() => {
    let active = true;
    void readReviewDates()
      .then((reports) => {
        if (active) setReviewDates(reports);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const dates = reviewDates.find((review) => review.reportSlug === reportSlug);
  const report = comparisonReports[reportSlug];
  return (
    <>
      {report.title} · sources checked {dates?.checkedOn ?? report.sourcesReviewedOn} ·{' '}
      {report.sourceReviewCadence.toLowerCase()} review · next due{' '}
      {dates?.nextDue ?? report.nextSourceReviewDue}
    </>
  );
}

export function ComparisonReviewReminder() {
  const [reviewDates, setReviewDates] = useState(fallbackReviewDates);
  const [busySlug, setBusySlug] = useState<ComparisonReportSlug | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void readReviewDates()
      .then((reports) => {
        if (active) setReviewDates(reports);
      })
      .catch(() => {
        if (active) setError('Review dates could not be refreshed. Check the API before recording a review.');
      });
    return () => {
      active = false;
    };
  }, []);

  const dueReports = reviewDates.filter((review) => daysUntil(review.nextDue) <= 21);
  if (dueReports.length === 0) return null;

  const markReviewed = async (reportSlug: ComparisonReportSlug) => {
    setBusySlug(reportSlug);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(
        `${apiBase}/newsroom/comparison-reviews/${reportSlug}/complete`,
        { method: 'POST', credentials: 'same-origin' },
      );
      const result = (await response.json()) as ComparisonReviewDate & { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'The review could not be saved.');
      setReviewDates((current) =>
        current.map((review) => (review.reportSlug === reportSlug ? result : review)),
      );
      setNotice(`${comparisonReports[reportSlug].title} review recorded.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The review could not be saved.');
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <section
      data-testid="comparison-review-reminder"
      aria-labelledby="comparison-review-reminder-title"
      className="border-b border-primary/30 bg-primary/5 py-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow text-primary">Editorial reminder</p>
          <h2 id="comparison-review-reminder-title" className="mt-2 font-serif text-3xl">
            Comparison sources are due for review.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            These monthly checks are due within three weeks or overdue. Review the official vendor
            documentation and record each completed check.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Due soon · {dueReports.length} {dueReports.length === 1 ? 'report' : 'reports'}
        </span>
      </div>
      {error && <p role="alert" className="mt-5 border border-destructive/35 p-3 text-sm text-destructive">{error}</p>}
      {notice && <p role="status" className="mt-5 border border-primary/25 p-3 text-sm text-primary">{notice}</p>}
      <div className="mt-6 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-2">
        {dueReports.map((review) => {
          const report = comparisonReports[review.reportSlug];
          const days = daysUntil(review.nextDue);
          return (
            <article
              key={review.reportSlug}
              data-testid={`comparison-review-${review.reportSlug}`}
              className="bg-background p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl">{report.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last checked {formatDate(review.checkedOn)} · due {formatDate(review.nextDue)}
                    {days < 0 ? ` · ${Math.abs(days)} days overdue` : ` · in ${days} days`}
                  </p>
                </div>
                <a
                  href={`/reports/${review.reportSlug}/`}
                  className="inline-flex items-center gap-1 border-b border-primary pb-1 text-sm text-primary"
                >
                  Open report <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
              <h4 className="mt-5 eyebrow text-muted-foreground">Official vendor sources</h4>
              <ul className="mt-2 grid gap-2">
                {report.rows.map((row) => (
                  <li key={row.sourceUrl} className="text-sm">
                    <span className="mr-2 text-muted-foreground">{row.product}</span>
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline decoration-primary/40 underline-offset-2"
                    >
                      {row.sourceLabel}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                data-testid={`button-mark-comparison-reviewed-${review.reportSlug}`}
                disabled={busySlug !== null}
                onClick={() => void markReviewed(review.reportSlug)}
                className="mt-5 inline-flex min-h-10 items-center gap-2 bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background disabled:opacity-50"
              >
                <RefreshCw size={13} aria-hidden="true" />
                {busySlug === review.reportSlug ? 'Saving review…' : 'Mark sources reviewed'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
