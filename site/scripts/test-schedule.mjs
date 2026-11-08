// Builds the site as it will look at every upcoming publish time and runs the
// SEO checks for each, so a scheduled article can't break a future auto-publish
// (for example by linking to an article that isn't live yet).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { astroBin } from './astro-bin.mjs';

const SITE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(SITE_DIR);
const ASTRO = astroBin(SITE_DIR);

const dir = 'src/content/articles';
const now = Date.now();
const times = [...new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
  const m = fs.readFileSync(path.join(dir, f), 'utf8').match(/^date:\s*"?([^"\n]+)"?\s*$/m);
  return m ? Date.parse(m[1]) : NaN;
}).filter((t) => t > now))].sort();
times.push(Infinity);

let failed = 0;
for (const t of times) {
  const at = t === Infinity ? 'all scheduled' : new Date(t + 60_000).toISOString();
  const env = { ...process.env, ASTRO_OUT_DIR: 'dist-schedule-test', ASTRO_TELEMETRY_DISABLED: '1' };
  if (t === Infinity) env.PUBLISH_SCHEDULED = 'true'; else env.BUILD_NOW = at;
  const b = spawnSync(process.execPath, [ASTRO, 'build'], { env, encoding: 'utf8' });
  const c = b.status === 0 ? spawnSync(process.execPath, ['scripts/check-build.mjs'], { env, encoding: 'utf8' }) : b;
  const ok = c.status === 0;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${at}`);
  if (!ok) console.log(((c.stdout || '') + (c.stderr || '') + (c.error ? String(c.error) : '')).split('\n').filter((l) => /ERROR|error/i.test(l)).slice(0, 10).join('\n'));
}
fs.rmSync('dist-schedule-test', { recursive: true, force: true });
process.exit(failed ? 1 : 0);
