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
  tip.setAttribute('role', 'tooltip');
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

reveal();
countUp();
progress();
tooltips();
