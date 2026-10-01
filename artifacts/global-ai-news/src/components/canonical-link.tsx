import type { ComponentProps } from 'react';
import { Link as WouterLink } from 'wouter';
import { SITE_URL } from '@/seo-metadata';

type CanonicalLinkProps = Extract<ComponentProps<typeof WouterLink>, { href: string }>;
const siteOrigin = new URL(SITE_URL).origin;

function canonicalInternalHref(href: string): string {
  if (!href || href.startsWith('#') || href.startsWith('?')) return href;

  try {
    const resolved = new URL(href, SITE_URL);
    if (resolved.origin !== siteOrigin) return href;

    const pathname =
      resolved.pathname === '/'
        ? '/'
        : `${resolved.pathname.replace(/\/+$/, '')}/`;
    return `${pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return href;
  }
}

export function Link({ href, ...props }: CanonicalLinkProps) {
  return <WouterLink {...props} href={canonicalInternalHref(href)} />;
}