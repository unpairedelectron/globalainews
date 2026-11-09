// Pulls articles and article images from the public GitHub repo, so content
// merged into `main` goes live without a Replit redeploy. Code is never pulled:
// only site/src/content/articles/** and site/public/images/articles/**.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const REPO = process.env.CONTENT_REPO || 'unpairedelectron/globalainews';
const BRANCH = process.env.CONTENT_BRANCH || 'main';
const PULL = [
  ['site/src/content/articles/', 'src/content/articles/'],
  ['site/public/images/articles/', 'public/images/articles/'],
];
const UA = { 'User-Agent': 'GlobalAINews-ContentSync/1.0' };

export async function latestSha() {
  const r = await fetch(`https://api.github.com/repos/${REPO}/commits/${BRANCH}`, {
    headers: { ...UA, Accept: 'application/vnd.github.sha' },
  });
  if (!r.ok) throw new Error(`GitHub API HTTP ${r.status}`);
  return (await r.text()).trim();
}

// Minimal tar reader (ustar + pax long names), enough for GitHub tarballs.
function* tarEntries(buf) {
  let off = 0;
  let paxPath = null;
  while (off + 512 <= buf.length) {
    const h = buf.subarray(off, off + 512);
    if (h.every((b) => b === 0)) break;
    const str = (a, b) => h.subarray(a, b).toString('utf8').replace(/\0.*$/s, '');
    const size = parseInt(str(124, 136).trim() || '0', 8);
    const type = String.fromCharCode(h[156] || 48);
    const prefix = str(345, 500);
    let name = (prefix ? `${prefix}/` : '') + str(0, 100);
    const data = buf.subarray(off + 512, off + 512 + size);
    off += 512 + Math.ceil(size / 512) * 512;
    if (type === 'x') {
      const m = data.toString('utf8').match(/\d+ path=([^\n]+)\n/);
      paxPath = m ? m[1] : null;
      continue;
    }
    if (type === 'g') continue;
    if (paxPath) { name = paxPath; paxPath = null; }
    yield { name, type, data };
  }
}

// Downloads `sha` and returns a Map of site-relative path -> Buffer.
export async function fetchContent(sha) {
  const r = await fetch(`https://codeload.github.com/${REPO}/tar.gz/${sha}`, { headers: UA });
  if (!r.ok) throw new Error(`codeload HTTP ${r.status}`);
  const tar = zlib.gunzipSync(Buffer.from(await r.arrayBuffer()));
  const files = new Map();
  for (const e of tarEntries(tar)) {
    if (e.type !== '0' && e.type !== '\0') continue;
    const rel = e.name.slice(e.name.indexOf('/') + 1); // drop "<repo>-<sha>/"
    for (const [from, to] of PULL) {
      if (rel.startsWith(from)) {
        const sub = rel.slice(from.length);
        if (!sub || sub.includes('..')) continue;
        files.set(to + sub, e.data);
      }
    }
  }
  if (![...files.keys()].some((k) => k.endsWith('.md'))) throw new Error('downloaded archive has no articles');
  return files;
}

// Replaces the content directories with `files`. Returns a restore() function.
// The directories are emptied and refilled in place rather than renamed: on
// Replit deployments they can sit on a different filesystem from their parent,
// where rename() fails with EXDEV. Backups are copies, so they work across
// filesystems too.
function emptyDir(dir) {
  for (const name of fs.readdirSync(dir)) fs.rmSync(path.join(dir, name), { recursive: true, force: true });
}

export function applyContent(siteDir, files) {
  const backups = [];
  for (const [, to] of PULL) {
    const dir = path.join(siteDir, to);
    const bak = `${dir.replace(/\/$/, '')}.bak-sync`;
    fs.rmSync(bak, { recursive: true, force: true });
    if (fs.existsSync(dir)) {
      fs.cpSync(dir, bak, { recursive: true });
      emptyDir(dir);
    } else {
      fs.mkdirSync(dir, { recursive: true });
    }
    backups.push([dir, bak]);
  }
  for (const [rel, data] of files) {
    const full = path.join(siteDir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, data);
  }
  return {
    restore() {
      for (const [dir, bak] of backups) {
        emptyDir(dir);
        if (fs.existsSync(bak)) fs.cpSync(bak, dir, { recursive: true });
        fs.rmSync(bak, { recursive: true, force: true });
      }
    },
    commit() { for (const [, bak] of backups) fs.rmSync(bak, { recursive: true, force: true }); },
  };
}
