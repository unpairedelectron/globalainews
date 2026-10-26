import React, { useEffect } from 'react';
import { ADSENSE_PUBLISHER_ID } from '../adsense-config';
import { activateAdSlot, isAdSlotActive, type AdPlacement } from './adsense-policy';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, never>>;
  }
}

const ADSENSE_CLIENT_ID = `ca-${ADSENSE_PUBLISHER_ID}`;
const adsenseEnabled = import.meta.env?.VITE_ENABLE_ADSENSE === 'true';
const configuredClientId = import.meta.env?.VITE_ADSENSE_CLIENT_ID;

const slotIds: Record<AdPlacement, string | undefined> = {
  home: import.meta.env?.VITE_ADSENSE_HOME_SLOT,
  article: import.meta.env?.VITE_ADSENSE_ARTICLE_SLOT,
};

export function AdSlot({ placement }: { placement: AdPlacement }) {
  const slotId = slotIds[placement];
  const active = isAdSlotActive({
    enabled: adsenseEnabled,
    publisherId: ADSENSE_PUBLISHER_ID,
    clientId: configuredClientId,
    slotId,
  });

  useEffect(() => {
    activateAdSlot(placement, slotId, active, ADSENSE_CLIENT_ID);
  }, [active, placement, slotId]);

  return (
    active &&
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
      ) : null}
    </aside>
  );
}
