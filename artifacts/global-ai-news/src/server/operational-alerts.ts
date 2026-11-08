export type OperationalAlert = {
  service: 'global-ai-news';
  event: 'api_health_degraded' | 'article_render_failures' | 'published_citation_removals';
  summary: string;
  route: string;
  requestId: string;
  occurredAt: string;
  consecutiveFailures?: number;
  failuresInWindow?: number;
  citations?: Array<{
    routes: string[];
    sourceName: string;
    sourceUrl: string;
    lastChecked: string;
    httpStatus: number | null;
  }>;
};

type AlertOptions = {
  webhookUrl?: string;
  fetcher?: typeof fetch;
  log?: (event: string, fields: Record<string, unknown>) => void;
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
};

const API_FAILURE_THRESHOLD = 3;
const ARTICLE_FAILURE_THRESHOLD = 5;
const ARTICLE_FAILURE_WINDOW_MS = 5 * 60_000;
const ALERT_COOLDOWN_MS = 15 * 60_000;
const DELIVERY_MAX_ATTEMPTS = 3;
const DELIVERY_BACKOFF_MS = [100, 300] as const;

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

function safeRoute(route: string): string {
  if (route.length > 200 || !/^\/[a-zA-Z0-9/_~.-]*$/.test(route)) {
    return '/unknown';
  }
  return route;
}

export class OperationalAlertManager {
  private readonly webhookUrl: string | undefined;
  private readonly fetcher: typeof fetch;
  private readonly log: NonNullable<AlertOptions['log']>;
  private readonly now: () => number;
  private readonly sleep: NonNullable<AlertOptions['sleep']>;
  private consecutiveApiFailures = 0;
  private articleFailures: Array<{ at: number; route: string; requestId: string }> = [];
  private readonly lastAlertAt = new Map<OperationalAlert['event'], number>();

  constructor(options: AlertOptions = {}) {
    this.webhookUrl = options.webhookUrl;
    this.fetcher = options.fetcher ?? fetch;
    this.log = options.log ?? ((event, fields) => {
      process.stderr.write(`${JSON.stringify({ event, ...fields })}\n`);
    });
    this.now = options.now ?? Date.now;
    this.sleep = options.sleep ?? sleep;
  }

  async recordApiHealthFailure(requestId: string): Promise<void> {
    this.consecutiveApiFailures += 1;
    if (this.consecutiveApiFailures < API_FAILURE_THRESHOLD) return;
    await this.alertOncePerCooldown({
      service: 'global-ai-news',
      event: 'api_health_degraded',
      summary: 'Newsroom API health check failed repeatedly.',
      route: '/api/healthz',
      requestId,
      occurredAt: new Date(this.now()).toISOString(),
      consecutiveFailures: this.consecutiveApiFailures,
    });
  }

  recordApiHealthSuccess(): void {
    this.consecutiveApiFailures = 0;
  }

  async recordArticleRenderFailure(route: string, requestId: string): Promise<void> {
    const now = this.now();
    const cutoff = now - ARTICLE_FAILURE_WINDOW_MS;
    this.articleFailures = this.articleFailures.filter((failure) => failure.at >= cutoff);
    this.articleFailures.push({ at: now, route: safeRoute(route), requestId });
    if (this.articleFailures.length < ARTICLE_FAILURE_THRESHOLD) return;
    const latestFailure = this.articleFailures[this.articleFailures.length - 1];
    await this.alertOncePerCooldown({
      service: 'global-ai-news',
      event: 'article_render_failures',
      summary: 'Public article rendering is failing repeatedly.',
      route: latestFailure.route,
      requestId: latestFailure.requestId,
      occurredAt: new Date(now).toISOString(),
      failuresInWindow: this.articleFailures.length,
    });
  }

  async recordPublishedCitationRemovals(
    citations: NonNullable<OperationalAlert['citations']>,
  ): Promise<void> {
    if (citations.length === 0) return;
    const firstRoute = citations[0].routes[0] ?? '/unknown';
    await this.alertOncePerCooldown({
      service: 'global-ai-news',
      event: 'published_citation_removals',
      summary: `${citations.length} published source link(s) returned persistent 404/410 responses.`,
      route: safeRoute(firstRoute),
      requestId: crypto.randomUUID(),
      occurredAt: new Date(this.now()).toISOString(),
      citations: citations.slice(0, 40).map((citation) => ({
        ...citation,
        routes: citation.routes.map(safeRoute),
      })),
    });
  }

  private async alertOncePerCooldown(alert: OperationalAlert): Promise<void> {
    const now = this.now();
    const lastAlert = this.lastAlertAt.get(alert.event) ?? 0;
    if (now - lastAlert < ALERT_COOLDOWN_MS) return;
    this.lastAlertAt.set(alert.event, now);

    if (!this.webhookUrl) {
      this.log('operational_alert_delivery_unconfigured', {
        event: alert.event,
        route: alert.route,
        requestId: alert.requestId,
      });
      return;
    }

    const request: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: [
          `${alert.summary} Route: ${alert.route}. Reference: ${alert.requestId}.`,
          ...(alert.citations ?? []).map((citation) =>
            `${citation.routes.join(', ')} — ${citation.sourceName}: ${citation.sourceUrl} (last checked ${citation.lastChecked})`,
          ),
        ].join('\n'),
        alert,
      }),
    };

    for (let attempt = 1; attempt <= DELIVERY_MAX_ATTEMPTS; attempt += 1) {
      let statusCode: number | undefined;
      let retryable = true;
      try {
        const response = await this.fetcher(this.webhookUrl, {
          ...request,
          signal: AbortSignal.timeout(5_000),
        });
        if (response.ok) return;
        statusCode = response.status;
        retryable = isRetryableStatus(response.status);
        await response.body?.cancel().catch(() => undefined);
      } catch {
        // Network errors and timeouts are transient; never log exception contents.
      }

      const willRetry = retryable && attempt < DELIVERY_MAX_ATTEMPTS;
      this.log('operational_alert_delivery_failed', {
        event: alert.event,
        attempt,
        maxAttempts: DELIVERY_MAX_ATTEMPTS,
        ...(statusCode === undefined ? {} : { statusCode }),
        willRetry,
        requestId: alert.requestId,
      });
      if (!willRetry) return;
      await this.sleep(DELIVERY_BACKOFF_MS[attempt - 1]);
    }
  }
}

export async function checkNewsroomApiHealth(
  apiOrigin: string | undefined,
  alerts: OperationalAlertManager,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const requestId = crypto.randomUUID();
  try {
    if (!apiOrigin) throw new Error('API origin is not configured');
    const endpoint = new URL('/api/healthz', apiOrigin);
    const response = await fetcher(endpoint, {
      headers: { accept: 'application/json', 'x-gan-request-id': requestId },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error('Health endpoint returned an unsuccessful status');
    const body: unknown = await response.json();
    if (!body || typeof body !== 'object' || !('status' in body) || body.status !== 'ok') {
      throw new Error('Health endpoint returned an invalid response');
    }
    alerts.recordApiHealthSuccess();
  } catch {
    await alerts.recordApiHealthFailure(requestId);
  }
}
