export type OperationalAlert = {
  service: 'global-ai-news';
  event: 'api_health_degraded' | 'article_render_failures';
  summary: string;
  route: string;
  requestId: string;
  occurredAt: string;
  consecutiveFailures?: number;
  failuresInWindow?: number;
};

type AlertOptions = {
  webhookUrl?: string;
  fetcher?: typeof fetch;
  log?: (event: string, fields: Record<string, unknown>) => void;
  now?: () => number;
};

const API_FAILURE_THRESHOLD = 3;
const ARTICLE_FAILURE_THRESHOLD = 5;
const ARTICLE_FAILURE_WINDOW_MS = 5 * 60_000;
const ALERT_COOLDOWN_MS = 15 * 60_000;

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

    try {
      const response = await this.fetcher(this.webhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: `${alert.summary} Route: ${alert.route}. Reference: ${alert.requestId}.`,
          alert,
        }),
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        this.log('operational_alert_delivery_failed', {
          event: alert.event,
          statusCode: response.status,
          requestId: alert.requestId,
        });
      }
    } catch {
      this.log('operational_alert_delivery_failed', {
        event: alert.event,
        requestId: alert.requestId,
      });
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
