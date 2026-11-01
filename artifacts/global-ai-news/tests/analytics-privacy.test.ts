import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { initializeClarity, isClarityEligibleUrl, trackEvent } from '../src/analytics';
import {
  clearSearchQueryHandoff,
  handoffSearchQuery,
  readSearchQueryHandoff,
  subscribeToSearchQueryHandoff,
} from '../src/search-handoff';

function createClarityEnvironment(
  pathname: string,
  search = '',
  hash = '',
  referrer = '',
) {
  const listeners = new Map<string, () => void>();
  let timerCallback: (() => void) | undefined;
  let timerDelay = 0;
  const scripts: Array<{
    async: boolean;
    src: string;
    dataset: Record<string, string>;
    onerror: (() => void) | null;
  }> = [];
  const targetWindow = {
    location: { pathname, search, hash },
    __globalAiClarityStarted: false,
    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      listeners.set(type, () => {
        if (typeof listener === 'function') listener(new Event(type));
        else listener.handleEvent(new Event(type));
      });
    },
    removeEventListener(type: string) {
      listeners.delete(type);
    },
    setTimeout(callback: () => void, delay: number) {
      timerCallback = callback;
      timerDelay = delay;
      return 1;
    },
    clearTimeout() {
      timerCallback = undefined;
    },
  };
  const targetDocument = {
    referrer,
    head: {
      appendChild(script: (typeof scripts)[number]) {
        scripts.push(script);
        script.onerror?.();
      },
    },
    createElement(tagName: string) {
      assert.equal(tagName, 'script');
      return {
        async: false,
        src: '',
        dataset: {},
        onerror: null,
      };
    },
    querySelector(selector: string) {
      assert.match(selector, /data-clarity-project/);
      return scripts[0] ?? null;
    },
  };
  return {
    scripts,
    targetWindow: targetWindow as unknown as Window,
    targetDocument: targetDocument as unknown as Document,
    fireInteraction() {
      listeners.get('pointerdown')?.();
    },
    fireTimeout() {
      timerCallback?.();
    },
    get timerDelay() {
      return timerDelay;
    },
  };
}

test('Clarity is limited to public, query-free URLs and safe referrers', () => {
  assert.equal(isClarityEligibleUrl({ pathname: '/', search: '', hash: '' }), true);
  assert.equal(isClarityEligibleUrl({ pathname: '/article/story', search: '', hash: '' }), true);
  assert.equal(isClarityEligibleUrl({ pathname: '/search', search: '?q=person%40example.com', hash: '' }), false);
  assert.equal(isClarityEligibleUrl({ pathname: '/article/story', search: '', hash: '#private-value' }), false);
  assert.equal(isClarityEligibleUrl({ pathname: '/insights/history', search: '', hash: '' }), false);
  assert.equal(isClarityEligibleUrl({ pathname: '/sign-up/verify', search: '', hash: '' }), false);
  assert.equal(isClarityEligibleUrl(
    { pathname: '/article/story', search: '', hash: '' },
    'https://globalainews.in/search?q=private%20message',
  ), false);
  assert.equal(isClarityEligibleUrl(
    { pathname: '/article/story', search: '', hash: '' },
    'https://globalainews.in/insights',
  ), false);
});

test('Clarity waits for interaction, injects one asynchronous script, and tolerates blocking', () => {
  const environment = createClarityEnvironment('/');
  const { scripts, targetWindow, targetDocument, fireInteraction } = environment;
  assert.equal(initializeClarity(targetWindow, targetDocument), true);
  assert.equal(initializeClarity(targetWindow, targetDocument), false);
  assert.equal(environment.timerDelay, 4000);
  assert.equal(scripts.length, 0);
  fireInteraction();
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].async, true);
  assert.equal(scripts[0].src, 'https://www.clarity.ms/tag/x8gfztdtd7');
  assert.equal(scripts[0].dataset.clarityProject, 'x8gfztdtd7');
  assert.doesNotThrow(() => scripts[0].onerror?.());
});

test('Clarity starts after four seconds when no interaction occurs', () => {
  const { scripts, targetWindow, targetDocument, fireTimeout } = createClarityEnvironment('/article/story');
  assert.equal(initializeClarity(targetWindow, targetDocument), true);
  assert.equal(scripts.length, 0);
  fireTimeout();
  assert.equal(scripts.length, 1);
});

test('existing event tracking sends conversion data only to platform analytics', () => {
  const platformEvents: Array<[string, Record<string, string | number | boolean> | undefined]> = [];
  const clarityCalls: unknown[][] = [];
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      umami: { track: (name: string, data?: Record<string, string | number | boolean>) => platformEvents.push([name, data]) },
      clarity: (...args: unknown[]) => clarityCalls.push(args),
    },
  });
  try {
    trackEvent('newsletter_subscribed', { location: 'full' });
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
  assert.deepEqual(platformEvents, [['newsletter_subscribed', { location: 'full' }]]);
  assert.deepEqual(clarityCalls, []);
});

test('in-app search keeps free text out of its URL', async () => {
  const observedSearches: string[] = [];
  const unsubscribe = subscribeToSearchQueryHandoff((query) => observedSearches.push(query));
  handoffSearchQuery('private search phrase');
  unsubscribe();
  assert.equal(readSearchQueryHandoff(), 'private search phrase');
  assert.equal(readSearchQueryHandoff(), 'private search phrase');
  assert.deepEqual(observedSearches, ['private search phrase']);
  clearSearchQueryHandoff();
  assert.equal(readSearchQueryHandoff(), null);

  const siteSource = await readFile(new URL('../src/components/site.tsx', import.meta.url), 'utf8');
  const searchSource = await readFile(new URL('../src/pages/public.tsx', import.meta.url), 'utf8');
  assert.match(siteSource, /handoffSearchQuery\(nextQuery\); setLocation\('\/search'\)/);
  assert.match(searchSource, /subscribeToSearchQueryHandoff\(\(nextQuery\) => \{[\s\S]*?setQuery\(nextQuery\);[\s\S]*?setLocation\('\/search', \{ replace: true \}\)/);
  assert.doesNotMatch(siteSource, /setLocation\(`\/search\?q=/);
  assert.doesNotMatch(searchSource, /setLocation\(nextQuery \? `\/search\?q=/);
});

test('user-entered newsletter, search, and Ask Global content is marked for Clarity masking', async () => {
  const files = [
    'src/components/site.tsx',
    'src/pages/public.tsx',
    'src/seo-prerender.tsx',
  ];
  for (const relativePath of files) {
    const source = await readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8');
    assert.match(source, /data-clarity-mask="true"/, `${relativePath} is missing an explicit Clarity mask`);
  }

  const privacy = await readFile(new URL('../src/editorial-pages.ts', import.meta.url), 'utf8');
  assert.match(privacy, /Microsoft Clarity on eligible public pages/);
  assert.match(privacy, /No custom signup or conversion event is sent to Clarity/);
  assert.match(privacy, /has not supplied approved details about consent, retention, data transfers/);
});
