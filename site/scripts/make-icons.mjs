// Renders PNG icons and the default social card from public/logo.svg.
// Run once: node scripts/make-icons.mjs (uses the system Playwright).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
const logo = fs.readFileSync('public/logo.svg', 'utf8');
const font = fs.readFileSync('public/fonts/instrument-serif-regular-latin.woff2').toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
async function shot(w, h, html, out) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><head><style>@font-face{font-family:IS;src:url(data:font/woff2;base64,${font})}html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}</style></head><body>${html}</body></html>`);
  await page.waitForTimeout(150);
  await page.screenshot({ path: out });
}
const icon = (s, bg) => `<div style="width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center;background:${bg}">${logo.replace('<svg', `<svg width="${Math.round(s * 0.9)}" height="${Math.round(s * 0.9)}"`)}</div>`;
await shot(512, 512, icon(512, '#ffffff'), 'public/logo-512.png');
await shot(180, 180, icon(180, '#ffffff'), 'public/apple-touch-icon.png');
await shot(32, 32, icon(32, '#ffffff'), 'public/favicon-32.png');
await shot(1200, 630, `<div style="width:1200px;height:630px;background:#fbfaf7;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box;border-bottom:14px solid #1f4fd1">
  <div style="display:flex;align-items:center;gap:26px">${logo.replace('<svg', '<svg width="120" height="120"')}<div style="font:400 96px IS,serif;color:#15171c">Global AI News</div></div>
  <div style="font:500 40px system-ui,sans-serif;color:#5a606b;margin-top:34px">AI news, explained with the sources.</div></div>`, 'public/og-default.png');
await browser.close();
console.log('icons written');
