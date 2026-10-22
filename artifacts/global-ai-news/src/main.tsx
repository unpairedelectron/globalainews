import { createRoot } from 'react-dom/client';

import { ErrorBoundary } from '@/components/error-boundary';
import { initializeTheme } from './theme';
import { initializeClarity, trackEvent } from './analytics';
import { STATIC_PRERENDER_ROUTES } from './static-prerender-routes';

import './index.css';

const initialTheme = initializeTheme();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function observeWebVitals(): void {
  if (typeof PerformanceObserver === "undefined") return;
  const observe = (type: string, readValue: (entry: PerformanceEntry) => number) => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const entry = entries[entries.length - 1];
        if (!entry) return;
        trackEvent("web_vital", {
          metric: type,
          value: Math.round(readValue(entry) * 100) / 100,
        });
      });
      observer.observe({ type, buffered: true } as PerformanceObserverInit);
    } catch {
      // Browsers without this observer do not block rendering.
    }
  };

  observe("largest-contentful-paint", (entry) => entry.startTime);
  observe("layout-shift", (entry) => {
    const shift = entry as PerformanceEntry & { value?: number };
    return shift.value ?? 0;
  });
  observe("event", (entry) => entry.duration);
}

observeWebVitals();

async function startApp(): Promise<void> {
  const prerenderMarker = document.getElementById('global-ai-prerender');
  const pathname = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length)
    : window.location.pathname;
  const route = pathname.replace(/\/+$/, '') || '/';
  initializeClarity(window, document, {
    pathname: route,
    search: window.location.search,
    hash: window.location.hash,
  });

  // These complete, link-only pages intentionally stay server-rendered. Their
  // client routes have a different shell, so createRoot would replace the
  // useful first response and create a late, larger LCP candidate.
  if (prerenderMarker && STATIC_PRERENDER_ROUTES.has(route)) return;

  const appPromise = import('./App');
  let initialSnapshot: unknown;
  if (prerenderMarker) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5_000);
    try {
      const response = await fetch(`${basePath}/api/newsroom/content`, {
        signal: controller.signal,
        credentials: 'same-origin',
      });
      if (response.ok) {
        const snapshot: unknown = await response.json();
        if (
          typeof snapshot === 'object' &&
          snapshot !== null &&
          'stories' in snapshot &&
          Array.isArray(snapshot.stories)
        ) {
          initialSnapshot = snapshot;
        }
      }
    } catch {
      // The newsroom query retries and renders its existing explicit error state.
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const { default: App, primeNewsroomContent } = await appPromise;
  if (initialSnapshot !== undefined) primeNewsroomContent(initialSnapshot);
  createRoot(document.getElementById('root')!, {
    // Keeps caught errors off reportError(), which would raise the dev overlay.
    onCaughtError: (error, errorInfo) => {
      console.error(error, errorInfo.componentStack);
    },
  }).render(<ErrorBoundary><App initialTheme={initialTheme} /></ErrorBoundary>);
}

void startApp();
