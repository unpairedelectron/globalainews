export type AdPlacement = 'home' | 'article';

export interface AdSlotConfiguration {
  enabled: boolean;
  publisherId: string;
  clientId?: string;
  slotId?: unknown;
}

export function isAdSlotActive({
  enabled,
  publisherId,
  clientId,
  slotId,
}: AdSlotConfiguration): boolean {
  return (
    enabled &&
    clientId === `ca-${publisherId}` &&
    typeof slotId === 'string' &&
    /^\d+$/.test(slotId)
  );
}

export type AdWindow = Window & {
  adsbygoogle?: Array<Record<string, never>>;
};

export function activateAdSlot(
  placement: AdPlacement,
  slotId: string | undefined,
  active: boolean,
  clientId: string,
  documentRef: Pick<Document, 'createElement' | 'getElementById' | 'querySelector' | 'head'> = document,
  windowRef: AdWindow = window as AdWindow,
) {
  if (!active || !slotId) return;

  const scriptId = 'global-ai-news-adsense';
  if (!documentRef.getElementById(scriptId)) {
    const script = documentRef.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    documentRef.head.appendChild(script);
  }

  const ad = documentRef.querySelector<HTMLElement>(
    `[data-ad-placement="${placement}"] .adsbygoogle`,
  );
  if (!ad || ad.dataset.adRequested === 'true') return;

  ad.dataset.adRequested = 'true';
  windowRef.adsbygoogle = windowRef.adsbygoogle ?? [];
  windowRef.adsbygoogle.push({});
}
