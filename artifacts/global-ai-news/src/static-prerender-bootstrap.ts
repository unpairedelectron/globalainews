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

export const STATIC_PRERENDER_CLARITY_BOOTSTRAP = `<script data-static-prerender-clarity>
(() => {
  const privatePrefixes = ['/insights', '/sign-in', '/sign-up', '/account', '/editor', '/admin', '/api', '/glucosmart-privacy'];
  const isPrivatePath = (pathname) => privatePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
  const isEligibleReferrer = () => {
    if (!document.referrer) return true;
    try {
      const referred = new URL(document.referrer);
      return !referred.search && !referred.hash && !isPrivatePath(referred.pathname.replace(/\\/+$/, '') || '/');
    } catch {
      return false;
    }
  };
  if (location.search || location.hash || isPrivatePath(location.pathname.replace(/\\/+$/, '') || '/') || !isEligibleReferrer()) return;
  if (window.__globalAiClarityStarted || document.querySelector('script[data-clarity-project="x8gfztdtd7"]')) return;
  window.__globalAiClarityStarted = true;
  const events = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll', 'click'];
  let timer;
  const start = () => {
    for (const event of events) window.removeEventListener(event, start);
    if (timer !== undefined) window.clearTimeout(timer);
    if (document.querySelector('script[data-clarity-project="x8gfztdtd7"]')) return;
    const clarity = (...args) => (clarity.q ??= []).push(args);
    clarity.q = [];
    window.clarity = clarity;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.clarity.ms/tag/x8gfztdtd7';
    script.dataset.clarityProject = 'x8gfztdtd7';
    script.onerror = () => {};
    document.head.appendChild(script);
  };
  for (const event of events) window.addEventListener(event, start, { once: true, passive: true });
  timer = window.setTimeout(start, 4000);
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
