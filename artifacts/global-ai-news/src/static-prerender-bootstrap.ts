export const STATIC_PRERENDER_THEME_BOOTSTRAP = `<script data-static-prerender-theme>
(() => {
  let theme = null;
  try { theme = localStorage.getItem('global-ai-news-theme'); } catch {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();
</script>`;

export const STATIC_PRERENDER_VITALS_BOOTSTRAP = `<script data-static-prerender-vitals>
(() => {
  if (typeof PerformanceObserver === 'undefined') return;
  const observe = (type, readValue) => {
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const entry = entries[entries.length - 1];
        if (!entry) return;
        try {
          window.umami?.track('web_vital', {
            metric: type,
            value: Math.round(readValue(entry) * 100) / 100,
          });
        } catch {}
      }).observe({ type, buffered: true });
    } catch {}
  };
  observe('largest-contentful-paint', (entry) => entry.startTime);
  observe('layout-shift', (entry) => entry.value ?? 0);
  observe('event', (entry) => entry.duration);
})();
</script>`;
