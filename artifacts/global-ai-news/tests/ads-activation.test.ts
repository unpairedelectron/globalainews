import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { activateAdSlot, isAdSlotActive, type AdPlacement } from '../src/components/adsense-policy';

const publisherId = 'pub-3766621537317806';
const clientId = `ca-${publisherId}`;
const placements: AdPlacement[] = ['home', 'article'];
const componentSource = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/components/monetization.tsx'),
  'utf8',
);

interface FakeAd extends HTMLElement {
  dataset: DOMStringMap;
}

function createBrowserMocks(placement: AdPlacement) {
  const scripts = new Map<string, HTMLScriptElement>();
  let queuedRequests = 0;
  const ad = { dataset: {} } as FakeAd;
  const documentRef = {
    createElement: () => ({ dataset: {} }) as HTMLScriptElement,
    getElementById: (id: string) => scripts.get(id) ?? null,
    querySelector: (selector: string) => (
      selector === `[data-ad-placement="${placement}"] .adsbygoogle` ? ad : null
    ),
    head: {
      appendChild: (script: HTMLScriptElement) => {
        scripts.set(script.id, script);
        return script;
      },
    },
  } as unknown as Pick<Document, 'createElement' | 'getElementById' | 'querySelector' | 'head'>;
  let requests: Array<Record<string, never>> | undefined;
  const windowRef = {} as Window & { adsbygoogle?: Array<Record<string, never>> };
  Object.defineProperty(windowRef, 'adsbygoogle', {
    get: () => requests,
    set: (value: Array<Record<string, never>> | undefined) => {
      requests = value;
      if (requests) {
        Object.defineProperty(requests, 'push', {
          value: (...ads: Record<string, never>[]) => {
            queuedRequests += ads.length;
            return requests?.length ?? 0;
          },
        });
      }
    },
  });
  return {
    documentRef,
    windowRef: windowRef as unknown as Window & { adsbygoogle?: Array<Record<string, never>> },
    scripts,
    ad,
    get queueInitialized() {
      return requests !== undefined;
    },
    get queuedRequests() {
      return queuedRequests;
    },
  };
}

for (const placement of placements) {
  test(`${placement} ad remains inert when enablement is missing`, () => {
    const active = isAdSlotActive({
      enabled: false,
      publisherId,
      clientId,
      slotId: '1234567890',
    });
    assert.equal(active, false);
    const browser = createBrowserMocks(placement);
    activateAdSlot(placement, '1234567890', active, clientId, browser.documentRef, browser.windowRef);
    assert.equal(browser.scripts.size, 0, 'no AdSense script should be injected');
    assert.equal(browser.queuedRequests, 0, 'no ad request should be queued');
    assert.equal(browser.queueInitialized, false, 'the AdSense queue should remain uninitialized');
  });

  test(`${placement} ad remains inert when the publisher ID does not match`, () => {
    const active = isAdSlotActive({
      enabled: true,
      publisherId,
      clientId: 'ca-pub-0000000000000000',
      slotId: '1234567890',
    });
    assert.equal(active, false);
    const browser = createBrowserMocks(placement);
    activateAdSlot(placement, '1234567890', active, clientId, browser.documentRef, browser.windowRef);
    assert.equal(browser.scripts.size, 0, 'no AdSense script should be injected');
    assert.equal(browser.queuedRequests, 0, 'no ad request should be queued');
    assert.equal(browser.queueInitialized, false, 'the AdSense queue should remain uninitialized');
  });

  for (const slotId of [undefined, '', '123slot', ' 1234567890 ', '12.3']) {
    test(`${placement} ad remains inert with slot ID ${JSON.stringify(slotId)}`, () => {
      const active = isAdSlotActive({ enabled: true, publisherId, clientId, slotId });
      assert.equal(active, false);
      const browser = createBrowserMocks(placement);
      activateAdSlot(
        placement,
        typeof slotId === 'string' ? slotId : undefined,
        active,
        clientId,
        browser.documentRef,
        browser.windowRef,
      );
      assert.equal(browser.scripts.size, 0, 'no AdSense script should be injected');
      assert.equal(browser.queuedRequests, 0, 'no ad request should be queued');
      assert.equal(browser.queueInitialized, false, 'the AdSense queue should remain uninitialized');
    });
  }

  test(`${placement} ad activates only with approved publisher settings and a numeric slot ID`, () => {
    const slotId = placement === 'home' ? '1234567890' : '9876543210';
    const active = isAdSlotActive({ enabled: true, publisherId, clientId, slotId });
    assert.equal(active, true);
    const browser = createBrowserMocks(placement);
    activateAdSlot(placement, slotId, active, clientId, browser.documentRef, browser.windowRef);
    assert.equal(browser.scripts.size, 1, 'the approved slot should inject the AdSense script');
    assert.match(
      browser.scripts.get('global-ai-news-adsense')?.src ?? '',
      new RegExp(`client=${clientId}$`),
      'the script must use the verified publisher client ID',
    );
    assert.equal(browser.ad.dataset.adRequested, 'true', 'the approved slot should be marked requested');
    assert.equal(browser.queuedRequests, 1, 'the approved slot should queue one ad request');
  });
}

test('homepage and article placements both use the guarded active check and activation path', () => {
  assert.match(componentSource, /isAdSlotActive\(/);
  assert.match(componentSource, /activateAdSlot\(placement, slotId, active/);
});
