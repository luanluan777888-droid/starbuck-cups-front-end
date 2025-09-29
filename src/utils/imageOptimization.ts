/**
 * Image optimization utilities for better performance
 */

export const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }

  // If it's already an optimized URL, return as is
  if (src.includes('/_next/image') || src.includes('?w=') || src.includes('&w=')) {
    return src;
  }

  // For external images or S3 images, use Next.js image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
};

export const getOptimizedImageProps = (src: string, alt: string, priority = false) => ({
  src,
  alt,
  priority,
  loading: priority ? 'eager' as const : 'lazy' as const,
  placeholder: 'blur' as const,
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
});

export const webpSources = (src: string, sizes?: string) => [
  {
    srcSet: `${src}?format=webp&w=640 640w, ${src}?format=webp&w=1024 1024w, ${src}?format=webp&w=1920 1920w`,
    type: 'image/webp',
    sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  },
  {
    srcSet: `${src}?format=avif&w=640 640w, ${src}?format=avif&w=1024 1024w, ${src}?format=avif&w=1920 1920w`,
    type: 'image/avif',
    sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  },
];

export const preloadCriticalImages = (images: string[]) => {
  if (typeof window !== 'undefined') {
    images.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
};