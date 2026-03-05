
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
 * In Vite/static deployment, use direct source URLs.
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
    quality,
    priority
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

function resolveImageSource(
  src: string,
  width?: number,
  quality?: number,
  priority?: boolean
): {
  imageSrc: string;
  imageSrcSet?: string;
  directFallbackSrc?: string;
} {
  const convertedSrc = convertDriveUrl(src);

  if (shouldBypassOptimization(convertedSrc)) {
    return { imageSrc: convertedSrc };
  }

  // Allow direct fallback for local assets and critical (priority) images.
  // This keeps LCP resilient when the optimizer origin fetch is slow.
  const allowDirectFallback =
    convertedSrc.startsWith("/") || Boolean(priority);

  // Next.js API image optimizer is no longer available after Vite migration.
  return {
    imageSrc: convertedSrc,
    directFallbackSrc: allowDirectFallback ? convertedSrc : undefined,
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

  // For static deployment, keep remote images as direct URLs.
  return true;
}

/**
 * Generate optimized image URL using our API
 */
function getOptimizedUrl(src: string, width?: number, quality?: number): string {
  void width;
  void quality;
  return src;
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
  const optimizedUrl = convertedSrc;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizedUrl;
  document.head.appendChild(link);
}
