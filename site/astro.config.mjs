import { defineConfig } from 'astro/config';
import { redirects } from './redirects.mjs';

// Static hosts without server-side redirects get meta-refresh stubs for these.
const staticRedirects = Object.fromEntries(
  Object.entries(redirects)
    .filter(([from]) => from.endsWith('/'))
    .map(([from, to]) => [from.replace(/\/$/, ''), to]),
);

export default defineConfig({
  site: 'https://www.globalainews.in',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: staticRedirects,
  compressHTML: true,
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
