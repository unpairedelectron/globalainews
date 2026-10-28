import React from 'react';
import { useEffect, useState } from 'react';

import {
  EDITORIAL_IMAGE_FALLBACK,
  getEditorialImagePath,
  getEditorialImageSources,
} from '../editorial-images';

type ResponsiveEditorialImageProps = {
  slug: string;
  alt: string;
  className: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  width?: number;
  height?: number;
};

export function ResponsiveEditorialImage({
  slug,
  alt,
  className,
  loading = 'lazy',
  fetchPriority,
  sizes = '(min-width: 768px) 600px, calc(100vw - 40px)',
  width = 1200,
  height = 675,
}: ResponsiveEditorialImageProps) {
  const [failed, setFailed] = useState(false);
  const sources = getEditorialImageSources(slug);

  useEffect(() => setFailed(false), [slug]);

  return (
    <picture className="block w-full">
      {!failed && fetchPriority !== 'high' && <>
        <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
        <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
      </>}
      <img
        src={failed ? EDITORIAL_IMAGE_FALLBACK : getEditorialImagePath(slug)}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={fetchPriority === 'high' ? undefined : 'async'}
        fetchPriority={fetchPriority}
        className={className}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
