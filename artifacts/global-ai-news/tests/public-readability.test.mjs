import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const [css, storyContent, site, prerender] = await Promise.all([
  readFile(path.join(root, 'src', 'index.css'), 'utf8'),
  readFile(path.join(root, 'src', 'components', 'story-content.tsx'), 'utf8'),
  readFile(path.join(root, 'src', 'components', 'site.tsx'), 'utf8'),
  readFile(path.join(root, 'src', 'seo-prerender.tsx'), 'utf8'),
]);

assert.match(css, /:root\s*\{[\s\S]*--background:\s*45 30% 95%/);
assert.match(css, /\.dark\s*\{[\s\S]*--background:\s*204 21% 8%/);
assert.match(css, /\.editorial-page :is\(\.prose, \.article-copy\) p\s*\{[\s\S]*line-height:\s*1\.82/);
assert.match(css, /\.table-scroll-region\s*\{[\s\S]*overflow-x:\s*auto/);
assert.match(css, /\.table-scroll-region:focus-visible/);
assert.match(css, /\.article-hero-image\s*\{[\s\S]*aspect-ratio:\s*1\.91\s*\/\s*1[\s\S]*object-fit:\s*cover/);

assert.match(storyContent, /className="table-scroll-region[^"]*"/);
assert.match(storyContent, /role="region"/);
assert.match(storyContent, /aria-label=\{section\.table\.caption \?\? `Scrollable data table in \$\{section\.heading\}`\}/);
assert.match(storyContent, /tabIndex=\{0\}/);
assert.match(storyContent, /scope: 'row'/);
assert.match(site, /className=\{`story-image \$\{className\}`\}/);
assert.match(site, /className="article-hero-image"/);

assert.match(prerender, /aria-label="Main navigation"/);
assert.match(prerender, /aria-label="Publication information"/);
assert.match(prerender, /className="article-hero-image"/);

console.log('Public readability contract confirmed for theme contrast, article copy, accessible tables, image sizing, and article chrome.');
