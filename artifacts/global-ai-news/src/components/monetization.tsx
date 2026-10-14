import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, never>>;
  }
}

const PUBLISHER_ID = 'pub-8304305694694077';
const ADSENSE_CLIENT_ID = `ca-${PUBLISHER_ID}`;
const adsenseEnabled =
  import.meta.env?.VITE_ENABLE_ADSENSE === 'true' &&
  import.meta.env?.VITE_ADSENSE_CLIENT_ID === ADSENSE_CLIENT_ID;

type AdPlacement = 'home' | 'article';

const slotIds: Record<AdPlacement, string | undefined> = {
  home: import.meta.env?.VITE_ADSENSE_HOME_SLOT,
  article: import.meta.env?.VITE_ADSENSE_ARTICLE_SLOT,
};

export function AdSlot({ placement }: { placement: AdPlacement }) {
  const slotId = slotIds[placement];
  const active =
    adsenseEnabled && typeof slotId === 'string' && /^\d+$/.test(slotId);

  useEffect(() => {
    if (!active || !slotId) return;

    const scriptId = 'global-ai-news-adsense';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      document.head.appendChild(script);
    }

    const ad = document.querySelector<HTMLElement>(
      `[data-ad-placement="${placement}"] .adsbygoogle`,
    );
    if (!ad || ad.dataset.adRequested === 'true') return;

    ad.dataset.adRequested = 'true';
    window.adsbygoogle = window.adsbygoogle ?? [];
    window.adsbygoogle.push({});
  }, [active, placement, slotId]);

  return (
    <aside
      data-testid={`ad-slot-${placement}`}
      data-ad-placement={placement}
      aria-label="Advertisement"
      className="my-8 min-h-[112px] border-y border-foreground/10 px-4 py-3 md:min-h-[112px]"
    >
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        Advertisement
      </p>
      {active && slotId ? (
        <ins
          className="adsbygoogle mt-2 block min-h-[72px]"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <p className="mt-2 flex min-h-[72px] items-center justify-center text-xs text-muted-foreground">
          Advertising is not currently enabled.
        </p>
      )}
    </aside>
  );
}
