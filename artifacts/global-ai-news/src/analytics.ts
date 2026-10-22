type AnalyticsData = Record<string, string | number | boolean>;

const CLARITY_PROJECT_ID = 'x8gfztdtd7';
const CLARITY_SCRIPT_SELECTOR = `script[data-clarity-project="${CLARITY_PROJECT_ID}"]`;
const PRIVATE_ROUTE_PREFIXES = [
  '/insights',
  '/sign-in',
  '/sign-up',
  '/account',
  '/editor',
  '/admin',
  '/api',
  '/glucosmart-privacy',
];

type ClarityQueue = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    umami?: {
      track(name: string, data?: AnalyticsData): void;
    };
    clarity?: ClarityQueue;
    __globalAiClarityStarted?: boolean;
  }
}

export function isClarityEligibleUrl(
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
  referrer = '',
): boolean {
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  if (location.search || location.hash) return false;
  if (PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return false;
  }
  if (referrer) {
    try {
      const referredUrl = new URL(referrer);
      const referredPath = referredUrl.pathname.replace(/\/+$/, '') || '/';
      if (
        referredUrl.search ||
        referredUrl.hash ||
        PRIVATE_ROUTE_PREFIXES.some((prefix) => referredPath === prefix || referredPath.startsWith(`${prefix}/`))
      ) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export function initializeClarity(
  targetWindow: Window = window,
  targetDocument: Document = document,
  location: Pick<Location, 'pathname' | 'search' | 'hash'> = targetWindow.location,
): boolean {
  if (!isClarityEligibleUrl(location, targetDocument.referrer)) return false;
  if (targetWindow.__globalAiClarityStarted || targetDocument.querySelector(CLARITY_SCRIPT_SELECTOR)) {
    return false;
  }

  targetWindow.__globalAiClarityStarted = true;
  const clarity: ClarityQueue = (...args) => {
    (clarity.q ??= []).push(args);
  };
  clarity.q = [];
  targetWindow.clarity = clarity;

  const script = targetDocument.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  script.dataset.clarityProject = CLARITY_PROJECT_ID;
  script.onerror = () => {
    // A blocked analytics request must not prevent the publication from rendering.
  };
  targetDocument.head.appendChild(script);
  return true;
}

export function trackEvent(name: string, data?: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics must never break the publication.
  }
}