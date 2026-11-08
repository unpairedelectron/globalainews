// Generates a 1200x675 hero and a 1200x630 social card for every article that
// has no `image` in its front matter, then adds `image` to the front matter.
// Run: node scripts/make-cards.mjs   (uses the system Playwright/Chromium)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const CATS = { models: 'AI Models', policy: 'Policy & Regulation', india: 'India AI', infrastructure: 'Chips & Infrastructure', safety: 'Safety & Security', business: 'Business & Work', research: 'Research', guides: 'Guides & Comparisons' };
const COLORS = { models: '#1f4fd1', policy: '#7a3fb8', india: '#c2541b', infrastructure: '#0f7a62', safety: '#b42a3a', business: '#1d6fa3', research: '#5a5f12', guides: '#1f4fd1' };
const font = fs.readFileSync('public/fonts/instrument-serif-regular-latin.woff2').toString('base64');
const logo = fs.readFileSync('public/logo.svg', 'utf8');
const dir = 'src/content/articles';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const browser = await chromium.launch();
const page = await browser.newPage();
let n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const file = path.join(dir, f);
  const src = fs.readFileSync(file, 'utf8');
  if (/^image:/m.test(src)) continue;
  const slug = f.replace(/\.md$/, '');
  const title = JSON.parse(src.match(/^title:\s*(".*")\s*$/m)[1]);
  const cat = JSON.parse(src.match(/^category:\s*(".*")\s*$/m)[1]);
  const color = COLORS[cat];
  const outDir = `public/images/articles/${slug}`;
  fs.mkdirSync(outDir, { recursive: true });
  for (const [w, h, name] of [[1200, 675, 'hero.jpg'], [1200, 630, 'og.jpg']]) {
    const size = title.length > 80 ? 62 : title.length > 55 ? 72 : 84;
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<html><head><style>@font-face{font-family:IS;src:url(data:font/woff2;base64,${font})}
      html,body{margin:0}body{width:${w}px;height:${h}px;background:#fbfaf7;font-family:system-ui,sans-serif;position:relative;overflow:hidden}
      .bar{position:absolute;left:0;top:0;bottom:0;width:22px;background:${color}}
      .wrap{position:absolute;left:90px;right:90px;top:70px;bottom:70px;display:flex;flex-direction:column;justify-content:space-between}
      .kick{font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${color};font-size:26px}
      h1{font:400 ${size}px/1.05 IS,serif;color:#15171c;margin:22px 0 0;letter-spacing:-.01em}
      .brand{display:flex;align-items:center;gap:16px;font:400 38px IS,serif;color:#15171c}
      .glow{position:absolute;right:-180px;bottom:-220px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,${color}22,transparent 70%)}
      </style></head><body><div class="bar"></div><div class="glow"></div><div class="wrap"><div><div class="kick">${esc(CATS[cat])}</div><h1>${esc(title)}</h1></div>
      <div class="brand">${logo.replace('<svg', '<svg width="56" height="56"')}Global AI News</div></div></body></html>`);
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${outDir}/${name}`, type: 'jpeg', quality: 86 });
  }
  const updated = src.replace(/^(category:.*)$/m, `$1\nimage: "/images/articles/${slug}/hero.jpg"\nimageAlt: ${JSON.stringify(title)}`);
  fs.writeFileSync(file, updated);
  n++;
}
await browser.close();
console.log(`cards generated for ${n} article(s)`);
