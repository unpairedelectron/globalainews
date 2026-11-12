// Shared motion layer: scroll reveals, count-up numbers, reading progress and
// chart tooltips. Everything degrades to fully visible, static content.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function reveal() {
  // Article figures, tables and data blocks rise in gently as you read.
  document.querySelectorAll<HTMLElement>('.prose img, .prose table, .prose details, .takeaways').forEach((el) => el.setAttribute('data-reveal', ''));
  const els = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group], .viz');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e) => io.observe(e));
  // Safety net: never leave content hidden.
  setTimeout(() => els.forEach((e) => e.classList.add('in')), 2500);
}

function countUp() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    const fmt = (n: number) => (el.dataset.prefix ?? '') + Math.round(n).toLocaleString('en-IN') + (el.dataset.suffix ?? '');
    if (reduce || !Number.isFinite(target)) { el.textContent = fmt(target); return; }
    const start = performance.now(), dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); }
  }, { threshold: 0.4 });
  els.forEach((e) => io.observe(e));
}

function progress() {
  const bar = document.querySelector<HTMLElement>('.progress');
  const body = document.querySelector<HTMLElement>('.article .prose');
  if (!bar || !body) return;
  let ticking = false;
  const update = () => {
    const r = body.getBoundingClientRect();
    const total = r.height - window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    bar.style.transform = `scaleX(${p})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

function tooltips() {
  const targets = document.querySelectorAll<SVGElement | HTMLElement>('[data-tip]');
  if (!targets.length) return;
  const tip = document.createElement('div');
  tip.className = 'viz-tip';
  tip.setAttribute('aria-hidden', 'true'); // same data is in each chart's aria-label and table
  document.body.appendChild(tip);
  const show = (el: Element, x: number, y: number) => {
    const [title, ...rest] = (el.getAttribute('data-tip') ?? '').split('|');
    tip.innerHTML = '';
    const b = document.createElement('b'); b.textContent = title; tip.appendChild(b);
    for (const line of rest) { const d = document.createElement('div'); d.textContent = line; tip.appendChild(d); }
    const w = tip.offsetWidth || 240;
    tip.style.left = `${Math.min(innerWidth - w - 12, x + 14)}px`;
    tip.style.top = `${y + 14}px`;
    tip.classList.add('on');
  };
  targets.forEach((el) => {
    el.addEventListener('pointermove', (e) => show(el, (e as PointerEvent).clientX, (e as PointerEvent).clientY));
    el.addEventListener('pointerleave', () => tip.classList.remove('on'));
    el.addEventListener('focus', () => { const r = el.getBoundingClientRect(); show(el, r.left, r.bottom); });
    el.addEventListener('blur', () => tip.classList.remove('on'));
  });
}

function citations() {
  const prose = document.querySelector<HTMLElement>('.article .prose');
  if (!prose) return;
  const kids = Array.from(prose.children);
  const srcIdx = kids.findIndex((el) => el.tagName === 'H2' && /^sources$/i.test(el.textContent?.trim() ?? ''));
  if (srcIdx < 0) return;
  const sources = new Map<number, string>();
  for (const el of kids.slice(srcIdx + 1)) {
    if (el.tagName === 'H2') break;
    if (el.tagName !== 'OL') continue;
    let n = Number(el.getAttribute('start')) || 1;
    for (const li of Array.from(el.children)) {
      if (li.tagName !== 'LI') continue;
      li.id = `src-${n}`;
      sources.set(n, (li.textContent ?? '').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim());
      n++;
    }
  }
  if (!sources.size) return;
  const MARK = /\[(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?\]/g;
  const clip = (t: string) => (t.length > 150 ? `${t.slice(0, 147)}…` : t);
  for (const block of kids.slice(0, srcIdx)) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest('a, code, pre, h2, h3') ? NodeFilter.FILTER_REJECT : MARK.test(n.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
    });
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const text = node.nodeValue ?? '';
      const frag = document.createDocumentFragment();
      let last = 0;
      MARK.lastIndex = 0;
      for (let m; (m = MARK.exec(text)); ) {
        const a = Number(m[1]), b = m[2] ? Number(m[2]) : a;
        if (!sources.has(a)) continue;
        frag.append(text.slice(last, m.index));
        const link = document.createElement('a');
        link.className = 'cite';
        link.href = `#src-${a}`;
        link.textContent = m[0];
        const lines: string[] = [];
        for (let k = a; k <= Math.min(b, a + 5); k++) if (sources.has(k)) lines.push(`[${k}] ${clip(sources.get(k)!)}`);
        link.setAttribute('data-tip', `${b > a ? `Sources ${a}–${b}` : `Source ${a}`}|${lines.join('|')}`);
        link.setAttribute('aria-label', `${b > a ? `Sources ${a} to ${b}` : `Source ${a}`}`);
        frag.append(link);
        last = m.index + m[0].length;
      }
      if (last === 0) continue;
      frag.append(text.slice(last));
      node.replaceWith(frag);
    }
  }
}

function tocSpy() {
  const links = new Map(Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc-float a[data-toc]')).map((a) => [a.dataset.toc!, a]));
  if (!links.size) return;
  const heads = Array.from(links.keys()).map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
  const update = () => {
    let active = heads[0];
    for (const h of heads) if (h.getBoundingClientRect().top < 160) active = h;
    links.forEach((a, id) => a.setAttribute('aria-current', String(id === active?.id)));
  };
  let t = false;
  addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(() => { update(); t = false; }); } }, { passive: true });
  update();
}

reveal();
countUp();
progress();
citations();
tocSpy();
tooltips();

// Offline reading: register the service worker after the page has loaded.
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
