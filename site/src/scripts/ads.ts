// Places mid-article ads between sections, then requests each ad only when it
// is about to scroll into view and is actually visible (rail is desktop-only).
type W = Window & { adsbygoogle?: unknown[] };

function placeMidArticle() {
  const prose = document.querySelector<HTMLElement>('.article .prose');
  if (!prose) return;
  const words = (prose.textContent ?? '').split(/\s+/).length;
  const h2s = Array.from(prose.querySelectorAll(':scope > h2')).filter((h) => !/^(sources|methodology note|faq|corrections log)$/i.test(h.textContent?.trim() ?? ''));
  const put = (sel: string, idx: number, minWords: number) => {
    const ad = document.querySelector<HTMLElement>(sel);
    if (!ad) return;
    // Before the (idx+1)th section heading, i.e. at the end of a section.
    if (h2s.length > idx + 1 && words >= minWords) h2s[idx].before(ad);
    else ad.remove();
  };
  put('.ad-mid', 2, 900);    // after the 2nd section
  put('.ad-mid2', 5, 1600);  // only on long reads
}

function lazyRequest() {
  const slots = Array.from(document.querySelectorAll<HTMLElement>('aside.ad[data-ad-place]'));
  if (!slots.length) return;
  const request = (el: HTMLElement) => {
    if (el.dataset.requested || el.offsetWidth === 0) return; // hidden (e.g. rail on mobile)
    el.dataset.requested = '1';
    const w = window as W;
    (w.adsbygoogle = w.adsbygoogle || []).push({});
  };
  if (!('IntersectionObserver' in window)) { slots.forEach(request); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { request(e.target as HTMLElement); io.unobserve(e.target); }
  }, { rootMargin: '600px 0px' });
  slots.forEach((s) => io.observe(s));
}

placeMidArticle();
lazyRequest();
