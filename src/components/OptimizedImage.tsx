'use client';

import { ImgHTMLAttributes } from 'react';
import { convertDriveUrl } from '@/utils/googleDriveHelper';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Custom optimized image component that works without Vercel
 * Uses our custom /api/image endpoint for optimization
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 75,
  priority = false,
  fill = false,
  sizes,
  className = '',
  fetchPriority,
  onError,
  style,
  ...props
}: OptimizedImageProps) {
  const { imageSrc, imageSrcSet, directFallbackSrc } = resolveImageSource(
    src,
    width,
    quality
  );

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const fallbackSrc = target.dataset.directSrc;

    if (
      fallbackSrc &&
      target.dataset.fallbackTried !== "1" &&
      target.src !== fallbackSrc
    ) {
      target.dataset.fallbackTried = "1";
      target.src = fallbackSrc;
      target.srcset = "";
      return;
    }

    if (onError) {
      onError(e);
    } else {
      // Fallback to placeholder
      target.src = '/images/placeholder.webp';
      target.srcset = "";
    }
  };

  if (fill) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={fetchPriority}
        decoding="async"
        srcSet={imageSrcSet}
        sizes={sizes}
        data-direct-src={directFallbackSrc}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          objectFit: 'cover',
          ...style,
        }}
        {...props}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={fetchPriority}
      decoding="async"
      srcSet={imageSrcSet}
      sizes={sizes}
      data-direct-src={directFallbackSrc}
      style={style}
      {...props}
    />
  );
}

function resolveImageSource(src: string, width?: number, quality?: number): {
  imageSrc: string;
  imageSrcSet?: string;
  directFallbackSrc?: string;
} {
  const convertedSrc = convertDriveUrl(src);

  if (shouldBypassOptimization(convertedSrc)) {
    return { imageSrc: convertedSrc };
  }

  return {
    imageSrc: getOptimizedUrl(convertedSrc, width, quality),
    imageSrcSet: buildSrcSet(convertedSrc, width, quality),
    directFallbackSrc: convertedSrc,
  };
}

function shouldBypassOptimization(src: string): boolean {
  if (
    src.startsWith('/') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return true;
  }

  if (!/^https?:\/\//i.test(src)) {
    return true;
  }

  try {
    const hostname = new URL(src).hostname.toLowerCase();
    if (hostname === "drive.google.com" || hostname === "docs.google.com") {
      return true;
    }

    return (
      hostname === "googleusercontent.com" ||
      hostname.endsWith(".googleusercontent.com") ||
      hostname === "amazonaws.com" ||
      hostname.endsWith(".amazonaws.com") ||
      hostname === "cloudfront.net" ||
      hostname.endsWith(".cloudfront.net")
    );
  } catch {
    return true;
  }
}

/**
 * Generate optimized image URL using our API
 */
function getOptimizedUrl(src: string, width?: number, quality?: number): string {
  const params = new URLSearchParams();
  params.set('url', src);
  
  if (width) {
    params.set('w', width.toString());
  }
  
  if (quality) {
    params.set('q', quality.toString());
  }
  
  // Let server negotiate AVIF/WebP based on request Accept header
  params.set('f', 'auto');
  
  return `/api/image?${params.toString()}`;
}

function buildSrcSet(src: string, width?: number, quality?: number): string | undefined {
  if (!width || width <= 0) return undefined;

  const maxTargetWidth = Math.min(Math.max(width * 2, width), 2000);
  const widthCandidates = [160, 200, 240, 280, 320, 360, 384, 420, 448, 480, 540, 640, 720, 768, 800, 840, 900, 960, 1200, 1600, 2000]
    .filter((candidate) => candidate <= maxTargetWidth);

  const targetWidths = new Set<number>(widthCandidates);
  targetWidths.add(Math.min(width, 2000));

  return Array.from(targetWidths)
    .sort((a, b) => a - b)
    .map((candidateWidth) => `${getOptimizedUrl(src, candidateWidth, quality)} ${candidateWidth}w`)
    .join(', ');
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, width?: number) {
  if (typeof window === 'undefined') return;

  const convertedSrc = convertDriveUrl(src);
  const optimizedUrl = convertedSrc.startsWith('/') 
    ? convertedSrc 
    : getOptimizedUrl(convertedSrc, width, 85);

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizedUrl;
  document.head.appendChild(link);
}
