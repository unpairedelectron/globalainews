import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1_000;
const INITIAL_DELAY_MS = 60_000;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_CONCURRENCY = 4;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const defaultStateFile = path.join(
  projectRoot,
  'reports',
  'published-evidence-link-audit.json',
);

export type EvidenceLinkStatus =
  | 'reachable'
  | 'transient-failure'
  | 'access-restricted'
  | 'removal-suspected'
  | 'persistent-removal';

export interface EvidenceLinkFinding {
  routes: string[];
  sources: Array<{ slug: string; name: string; publisher: string }>;
  url: string;
  status: EvidenceLinkStatus;
  httpStatus: number | null;
  consecutiveNotFound: number;
  lastChecked: string;
}

interface StoredFinding extends EvidenceLinkFinding {}

interface AuditState {
  version: 1;
  lastRunAt: string;
  sources: Record<string, StoredFinding>;
}

interface PublicSource {
  slug: string;
  name: string;
  publisher: string;
  url: string;
}

interface PublicStory {
  slug: string;
  sources: string[];
}

interface PublicContent {
  stories: PublicStory[];
  sources: PublicSource[];
}

export interface PublishedEvidenceAuditOptions {
  apiOrigin?: string;
  stateFile?: string;
  fetcher?: typeof fetch;
  now?: () => Date;
  log?: (event: string, fields: Record<string, unknown>) => void;
  notify?: (findings: EvidenceLinkFinding[]) => Promise<void>;
}

function logDefault(event: string, fields: Record<string, unknown>): void {
  process.stderr.write(`${JSON.stringify({ event, ...fields })}\n`);
}

function parsePublicContent(value: unknown): PublicContent {
  if (!value || typeof value !== 'object') {
    throw new Error('Public newsroom content has an invalid shape.');
  }
  const content = value as Record<string, unknown>;
  if (!Array.isArray(content.stories) || !Array.isArray(content.sources)) {
    throw new Error('Public newsroom content is missing stories or sources.');
  }

  const stories: PublicStory[] = content.stories.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const story = item as Record<string, unknown>;
    if (
      typeof story.slug !== 'string' ||
      !/^[a-z0-9-]{1,120}$/.test(story.slug) ||
      !Array.isArray(story.sources) ||
      story.status === 'private-draft' ||
      story.status === 'scheduled'
    ) {
      return [];
    }
    return [{
      slug: story.slug,
      sources: story.sources.filter(
        (slug): slug is string => typeof slug === 'string' && /^[a-z0-9-]{1,160}$/.test(slug),
      ),
    }];
  });

  const sources: PublicSource[] = content.sources.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const source = item as Record<string, unknown>;
    if (
      typeof source.slug !== 'string' ||
      !/^[a-z0-9-]{1,160}$/.test(source.slug) ||
      typeof source.name !== 'string' ||
      typeof source.publisher !== 'string' ||
      typeof source.url !== 'string'
    ) {
      return [];
    }
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(source.url);
    } catch {
      return [];
    }
    if (
      !['http:', 'https:'].includes(parsedUrl.protocol) ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      return [];
    }
    parsedUrl.hash = '';
    return [{
      slug: source.slug,
      name: source.name.slice(0, 240),
      publisher: source.publisher.slice(0, 160),
      url: parsedUrl.toString(),
    }];
  });

  return { stories, sources };
}

function publishedSourceRoutes(content: PublicContent): Map<string, {
  url: string;
  routes: Set<string>;
  sources: Map<string, { slug: string; name: string; publisher: string }>;
}> {
  const sourceBySlug = new Map(content.sources.map((source) => [source.slug, source]));
  const evidenceByUrl = new Map<string, {
    url: string;
    routes: Set<string>;
    sources: Map<string, { slug: string; name: string; publisher: string }>;
  }>();

  for (const story of content.stories) {
    for (const sourceSlug of story.sources) {
      const source = sourceBySlug.get(sourceSlug);
      if (!source) continue;
      const evidence = evidenceByUrl.get(source.url) ?? {
        url: source.url,
        routes: new Set<string>(),
        sources: new Map<string, { slug: string; name: string; publisher: string }>(),
      };
      evidence.routes.add(`/article/${story.slug}/`);
      evidence.sources.set(source.slug, {
        slug: source.slug,
        name: source.name,
        publisher: source.publisher,
      });
      evidenceByUrl.set(source.url, evidence);
    }
  }

  return evidenceByUrl;
}

function parseAuditState(raw: string): AuditState {
  const parsed: unknown = JSON.parse(raw);
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    (parsed as Record<string, unknown>).version !== 1 ||
    typeof (parsed as Record<string, unknown>).lastRunAt !== 'string' ||
    !(parsed as Record<string, unknown>).sources ||
    typeof (parsed as Record<string, unknown>).sources !== 'object'
  ) {
    throw new Error('Published evidence audit state is invalid; refusing to overwrite it.');
  }
  return parsed as AuditState;
}

async function readAuditState(stateFile: string): Promise<AuditState> {
  try {
    return parseAuditState(await readFile(stateFile, 'utf8'));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return { version: 1, lastRunAt: '', sources: {} };
    }
    throw error;
  }
}

function statusFromResponse(status: number): EvidenceLinkStatus {
  if (status >= 200 && status < 400) return 'reachable';
  if (status === 404 || status === 410) return 'removal-suspected';
  if ([401, 403, 451].includes(status)) return 'access-restricted';
  return 'transient-failure';
}

async function checkEvidenceUrl(
  url: string,
  fetcher: typeof fetch,
): Promise<{ status: EvidenceLinkStatus; httpStatus: number | null }> {
  try {
    const response = await fetcher(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/pdf,application/xhtml+xml,*/*;q=0.8',
        'user-agent': 'GlobalAI News Evidence Link Monitor/1.0',
        range: 'bytes=0-0',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const result = { status: statusFromResponse(response.status), httpStatus: response.status };
    await response.body?.cancel().catch(() => undefined);
    return result;
  } catch {
    return { status: 'transient-failure', httpStatus: null };
  }
}

async function mapConcurrent<T, R>(
  values: T[],
  concurrency: number,
  operation: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= values.length) return;
      results[index] = await operation(values[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function writeAuditState(stateFile: string, state: AuditState): Promise<void> {
  await mkdir(path.dirname(stateFile), { recursive: true });
  const temporaryFile = `${stateFile}.${process.pid}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  await rename(temporaryFile, stateFile);
}

export async function runPublishedEvidenceAudit(
  options: PublishedEvidenceAuditOptions = {},
): Promise<{ checked: number; findings: EvidenceLinkFinding[]; reportPath: string }> {
  const log = options.log ?? logDefault;
  const fetcher = options.fetcher ?? fetch;
  const now = options.now ?? (() => new Date());
  const stateFile = path.resolve(
    options.stateFile ?? process.env.PUBLISHED_EVIDENCE_AUDIT_STATE_FILE ?? defaultStateFile,
  );
  const apiOrigin = options.apiOrigin ?? process.env.NEWSROOM_API_ORIGIN;
  if (!apiOrigin) {
    log('published_evidence_audit_skipped', { reason: 'newsroom_api_origin_not_configured' });
    return { checked: 0, findings: [], reportPath: stateFile };
  }

  let endpoint: URL;
  try {
    endpoint = new URL('/api/newsroom/content', apiOrigin);
    if (!['http:', 'https:'].includes(endpoint.protocol)) {
      throw new Error('Unsupported newsroom API protocol.');
    }
  } catch {
    throw new Error('NEWSROOM_API_ORIGIN must be a valid HTTP or HTTPS origin.');
  }

  const snapshotResponse = await fetcher(endpoint, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!snapshotResponse.ok) {
    await snapshotResponse.body?.cancel().catch(() => undefined);
    throw new Error(`Public newsroom content returned HTTP ${snapshotResponse.status}.`);
  }
  const content = parsePublicContent(await snapshotResponse.json());
  const evidence = [...publishedSourceRoutes(content).values()];
  const previous = await readAuditState(stateFile);
  const checkedAt = now().toISOString();
  const checks = await mapConcurrent(evidence, MAX_CONCURRENCY, async (item) => ({
    item,
    result: await checkEvidenceUrl(item.url, fetcher),
  }));
  const nextSources: Record<string, StoredFinding> = {};
  const newlyPersistent: EvidenceLinkFinding[] = [];

  for (const { item, result } of checks) {
    const previousFinding = previous.sources[item.url];
    const consecutiveNotFound = result.status === 'removal-suspected'
      ? (previousFinding?.consecutiveNotFound ?? 0) + 1
      : result.status === 'reachable'
        ? 0
        : previousFinding?.consecutiveNotFound ?? 0;
    const status: EvidenceLinkStatus = result.status === 'removal-suspected'
      ? consecutiveNotFound >= 2 ? 'persistent-removal' : 'removal-suspected'
      : result.status;
    const finding: EvidenceLinkFinding = {
      routes: [...item.routes].sort(),
      sources: [...item.sources.values()].sort((left, right) => left.slug.localeCompare(right.slug)),
      url: item.url,
      status,
      httpStatus: result.httpStatus,
      consecutiveNotFound,
      lastChecked: checkedAt,
    };
    nextSources[item.url] = finding;
    if (status === 'persistent-removal' && previousFinding?.status !== 'persistent-removal') {
      newlyPersistent.push(finding);
    }
  }

  const state: AuditState = { version: 1, lastRunAt: checkedAt, sources: nextSources };
  await writeAuditState(stateFile, state);

  const persistentRemovals = Object.values(nextSources)
    .filter((finding) => finding.status === 'persistent-removal');
  const transientFailures = Object.values(nextSources)
    .filter((finding) => finding.status === 'transient-failure');
  const suspectedRemovals = Object.values(nextSources)
    .filter((finding) => finding.status === 'removal-suspected');
  log('published_evidence_audit_complete', {
    checked: evidence.length,
    persistentRemovals: persistentRemovals.length,
    suspectedRemovals: suspectedRemovals.length,
    transientFailures: transientFailures.length,
    reportPath: stateFile,
    lastChecked: checkedAt,
  });
  for (const finding of newlyPersistent) {
    log('published_evidence_link_persistent_removal', {
      routes: finding.routes,
      sources: finding.sources,
      url: finding.url,
      httpStatus: finding.httpStatus,
      lastChecked: finding.lastChecked,
    });
  }
  if (newlyPersistent.length > 0 && options.notify) {
    await options.notify(newlyPersistent);
  }

  return {
    checked: evidence.length,
    findings: Object.values(nextSources),
    reportPath: stateFile,
  };
}

export function startPublishedEvidenceAuditScheduler(
  options: PublishedEvidenceAuditOptions = {},
): () => void {
  let timer: NodeJS.Timeout | undefined;
  let stopped = false;

  const schedule = (delay: number): void => {
    if (stopped) return;
    timer = setTimeout(() => {
      void runPublishedEvidenceAudit(options)
        .catch(() => {
          (options.log ?? logDefault)('published_evidence_audit_failed', {
            reason: 'snapshot_or_state_unavailable',
          });
        })
        .finally(() => schedule(CHECK_INTERVAL_MS));
    }, delay);
    timer.unref();
  };

  schedule(INITIAL_DELAY_MS);
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
