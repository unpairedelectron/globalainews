// Editorial quality gate for new articles (dated on or after LINT_FROM).
// Runs as part of `npm run build`; fails the build on errors.
// Older, migrated articles are exempt because they predate these rules.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(SITE_DIR, 'src', 'content', 'articles');
const LINT_FROM = Date.parse('2026-11-09T00:00:00Z');

// Domains that count as primary sources (official, legal, academic).
const PRIMARY = [
  'openai.com', 'blog.google', 'deepmind.google', 'ai.google.dev', 'anthropic.com', 'arxiv.org', 'mistral.ai',
  'ai.meta.com', 'llama.com', 'github.blog', 'huggingface.co', 'microsoft.com', 'nvidia.com', 'pib.gov.in',
  'meity.gov.in', 'indiaai.gov.in', 'gov.in', 'nic.in', 'europa.eu', 'sec.gov', 'nist.gov', 'gov.uk', 'gov.au', 'gc.ca', 'canada.ca', 'whitehouse.gov',
  'nature.com', 'science.org', 'acm.org', 'ieee.org', 'doi.org', 'opensource.org', 'apache.org', 'owasp.org',
  'modelcontextprotocol.io', 'allenai.org', 'abc.xyz', 'atmeta.com', 'aboutamazon.com', 'apple.com', 'amazon.science', 'iea.org', 'oecd.org', 'un.org', 'who.int', 'c2pa.org',
];
const BANNED = [
  /\bas an ai (language )?model\b/i, /\bin today's fast-paced\b/i, /\bdelve\b/i, /\bgame[- ]changer\b/i, /\brevolutioni[sz]e\b/i,
  /\bin conclusion\b/i, /\bunleash\b/i, /\[citation needed\]/i, /\bTODO\b/, /\bTBD\b/, /lorem ipsum/i,
];

const errors = [];
const warnings = [];
let checked = 0;

for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.md'))) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { errors.push(`${f}: missing front matter`); continue; }
  const date = Date.parse((fm[1].match(/^date:\s*"?([^"\n]+)"?/m) || [])[1]);
  if (!(date >= LINT_FROM)) continue;
  if (/^draft:\s*true/m.test(fm[1])) continue;
  checked++;
  const body = src.slice(fm[0].length);
  const isBrief = /^type:\s*"?brief"?/m.test(fm[1]);
  const e = (m) => errors.push(`${f}: ${m}`);
  const w = (m) => warnings.push(`${f}: ${m}`);

  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (isBrief) { if (words < 150 || words > 600) e(`brief is ${words} words (150–600)`); }
  else if (words < 900) e(`only ${words} words (minimum 900)`);
  if (!isBrief && !/^## The bottom line/m.test(body)) e('missing "## The bottom line" section');
  if (!isBrief && !/^## FAQ/m.test(body)) e('missing "## FAQ" section');
  else if (!isBrief) if ((body.split(/^## FAQ/m)[1].split(/^## /m)[0].match(/^### /gm) || []).length < 3) e('FAQ needs at least 3 questions');
  if (!/^## Methodology note/m.test(body)) e('missing "## Methodology note"');
  if (!/AI[- ]assist/i.test(body)) e('methodology note must disclose AI assistance');

  const sourcesBlock = (body.split(/^## Sources/m)[1] || '').split(/^## /m)[0];
  const sources = [...sourcesBlock.matchAll(/^(\d+)\.\s+(.+)$/gm)].map((m) => ({ n: Number(m[1]), line: m[2] }));
  if (sources.length < (isBrief ? 1 : 3)) e(`needs at least ${isBrief ? 1 : 3} numbered source(s) (found ${sources.length})`);
  let primary = 0;
  for (const s of sources) {
    const url = s.line.match(/https?:\/\/[^\s)>\]]+/)?.[0];
    if (!url) { if (!/\b(ISBN|Pearson|press|edition)\b/i.test(s.line)) e(`source ${s.n} has no URL`); continue; }
    const host = new URL(url).hostname.replace(/^www\./, '');
    // Company investor-relations sites (filings, results) are primary too.
    if (PRIMARY.some((d) => host === d || host.endsWith(`.${d}`)) || /^(investors?|ir)\./.test(host)) primary++;
  }
  if (sources.length && primary < (isBrief ? 1 : 2)) e(`needs at least ${isBrief ? 1 : 2} primary source(s) (official/legal/academic); found ${primary}`);

  const cited = new Set([...body.split(/^## Sources/m)[0].matchAll(/\[(\d+)(?:[–-](\d+))?\]/g)].flatMap((m) => {
    const a = Number(m[1]); const b = Number(m[2] || m[1]);
    return Array.from({ length: Math.max(1, b - a + 1) }, (_, i) => a + i);
  }));
  for (const n of cited) if (!sources.find((s) => s.n === n)) e(`cites [${n}] but there is no source ${n}`);
  if (cited.size < Math.min(3, sources.length)) w(`only ${cited.size} sources are cited in the text`);

  const tkList = fm[1].match(/^takeaways:\n((?:\s+- .*\n?)+)/m)?.[1].match(/^\s+- /gm)?.length;
  const tkJson = (() => { try { return JSON.parse(fm[1].match(/^takeaways:\s*(\[.*\])\s*$/m)?.[1] ?? 'null')?.length; } catch { return 0; } })();
  const takeaways = tkList || tkJson || 0;
  if (takeaways < 3) e(isBrief ? 'brief needs 3 "what changed / why it matters" takeaways' : 'needs at least 3 takeaways');
  const seo = fm[1].match(/^seoTitle:\s*"(.*)"/m)?.[1];
  if (!seo) e('missing seoTitle');
  else if (seo.length > 60) e(`seoTitle is ${seo.length} chars (max 60)`);
  const desc = fm[1].match(/^description:\s*"(.*)"/m)?.[1] || '';
  if (desc.length < 110 || desc.length > 200) e(`description is ${desc.length} chars (110–200)`);
  for (const re of BANNED) if (re.test(body)) e(`banned phrase: ${re}`);
  if (/^reviewer:/m.test(fm[1]) && /AI-assisted; no human review/i.test(body)) e('reviewer set but article says no human review');
}

console.log(`Editorial lint: ${checked} new article(s) checked.`);
for (const x of warnings) console.log(`  warn  ${x}`);
for (const x of errors) console.log(`  ERROR ${x}`);
if (errors.length) { console.error(`${errors.length} editorial error(s).`); process.exit(1); }
