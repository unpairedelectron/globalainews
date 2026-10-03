import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const [themeSource, headerSource, cssSource, appSource, clerkSource, publicSource] = await Promise.all([
  readFile(path.join(root, 'src', 'theme.tsx'), 'utf8'),
  readFile(path.join(root, 'src', 'components', 'site.tsx'), 'utf8'),
  readFile(path.join(root, 'src', 'index.css'), 'utf8'),
  readFile(path.join(root, 'src', 'App.tsx'), 'utf8'),
  readFile(path.join(root, 'src', 'clerk-routes.tsx'), 'utf8'),
  readFile(path.join(root, 'src', 'pages', 'public.tsx'), 'utf8'),
]);

assert.match(themeSource, /global-ai-news-theme/, 'theme persistence key is missing');
assert.match(themeSource, /root\.classList\.toggle\('dark', theme === 'dark'\)/, 'dark mode does not update the document class');
assert.match(themeSource, /root\.style\.colorScheme = theme/, 'native controls are not told which color scheme is active');
assert.match(themeSource, /window\.matchMedia\?\.\('\(prefers-color-scheme: dark\)'\)/, 'system color preference is not supported');
assert.match(themeSource, /mediaQuery\.addEventListener\?\.\('change', handleChange\)/, 'system theme changes are not observed');

assert.match(headerSource, /data-testid="button-theme-toggle"/, 'the header theme toggle is missing');
assert.match(headerSource, /aria-pressed=\{theme === 'dark'\}/, 'the theme toggle is missing its pressed state');
assert.match(headerSource, /toggleTheme/, 'the theme toggle is not connected to the theme provider');

for (const variable of ['--background', '--foreground', '--surface', '--primary', '--muted-foreground', '--accent', '--danger']) {
  assert.match(cssSource, new RegExp(`${variable}:`), `${variable} is not documented in the CSS palette`);
}
assert.match(cssSource, /\.dark\s*\{[\s\S]*--background:/, 'dark palette variables are missing');
assert.match(cssSource, /:root\s*\{[\s\S]*--background:/, 'light palette variables are missing');
assert.match(cssSource, /:focus-visible\s*\{[\s\S]*--ring/, 'keyboard focus styling is missing');
assert.match(cssSource, /transition: background-color/, 'theme transitions are missing');

assert.match(clerkSource, /getClerkAppearance\(theme\)/, 'Clerk appearance is not synchronized with the active theme');
assert.match(appSource, /lazy\(\(\) => import\('\.\/clerk-routes'\)/, 'Clerk routes are not loaded lazily');
assert.doesNotMatch(appSource, /from ['"]@clerk\/react/, 'the public app entry statically imports Clerk');
assert.doesNotMatch(publicSource, /from ['"]@clerk\/react/, 'public pages statically import Clerk');
assert.match(appSource, /<ThemeProvider initialTheme=\{initialTheme\}>/, 'the app is not wrapped in the theme provider');

console.log('Theme contract confirmed for persistence, toggle semantics, palettes, focus, and Clerk styling.');