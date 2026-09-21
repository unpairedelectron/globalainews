import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { initializeTheme } from './theme';
import { trackEvent } from './analytics';

import './index.css';

const initialTheme = initializeTheme();

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

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(<ErrorBoundary><App initialTheme={initialTheme} /></ErrorBoundary>);
