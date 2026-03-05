import React, { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

// Dynamic import toàn bộ Swiper bundle
const SwiperCarousel = React.lazy(() => import("./SwiperCarousel"));

const SwiperFallback = () => (
  <div className="h-full bg-gray-200 rounded-2xl md:rounded-3xl animate-pulse" />
);

interface HeroImageData {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  order: number;
  isActive: boolean;
}

interface PromotionalBannerData {
  id: string;
  title: string;
  highlightText: string | null;
  highlightColor: string | null;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSectionProps {
  loading?: boolean;
  heroImages?: HeroImageData[];
  promotionalBanner?: PromotionalBannerData | null;
}

const HeroSectionSkeleton = () => (
  <section className="py-4 md:py-8">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="bg-zinc-900 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
          <div className="mb-4 md:mb-6 space-y-3">
            <div className="h-8 md:h-10 w-4/5 bg-zinc-800 rounded animate-pulse" />
            <div className="h-8 md:h-10 w-3/5 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="mb-6 md:mb-8 space-y-2">
            <div className="h-4 md:h-5 w-full bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 md:h-5 w-full bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 md:h-5 w-2/3 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="h-10 md:h-12 w-44 bg-zinc-800 rounded-full animate-pulse" />
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="h-48 md:h-64 lg:h-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900">
            <div className="h-full w-full bg-zinc-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HeroSection: React.FC<HeroSectionProps> = ({
  loading = false,
  heroImages = [],
  promotionalBanner = null,
}) => {
  const [showSwiper, setShowSwiper] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });
  const [isLowEndDevice, setIsLowEndDevice] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const memory = nav.deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    return prefersReducedMotion || memory <= 4 || cores <= 4;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      const nav = navigator as Navigator & { deviceMemory?: number };
      const memory = nav.deviceMemory ?? 4;
      const cores = navigator.hardwareConcurrency ?? 4;
      setIsLowEndDevice(reducedMotionQuery.matches || memory <= 4 || cores <= 4);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    reducedMotionQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
      reducedMotionQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    // Keep static hero image on constrained devices to avoid loading Swiper runtime.
    if (isMobileViewport || isLowEndDevice) {
      setShowSwiper(false);
      return;
    }

    let timeoutId: number | undefined;
    let idleId: number | undefined;
    let didEnable = false;

    const interactionEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "wheel",
    ];

    const enableSwiper = () => {
      if (didEnable) return;
      didEnable = true;
      setShowSwiper(true);
    };

    const scheduleEnable = () => {
      const requestIdle = (
        window as Window & {
          requestIdleCallback?: (
            callback: () => void,
            options?: { timeout: number }
          ) => number;
        }
      ).requestIdleCallback;

      if (typeof requestIdle === "function") {
        idleId = requestIdle(enableSwiper, { timeout: 1800 });
        return;
      }

      timeoutId = window.setTimeout(enableSwiper, 1200);
    };

    const handleFirstInteraction = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
      scheduleEnable();
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, {
        passive: true,
      });
    });

    const fallbackTimer = window.setTimeout(scheduleEnable, 15000);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (timeoutId) window.clearTimeout(timeoutId);
      const cancelIdle = (
        window as Window & {
          cancelIdleCallback?: (handle: number) => void;
        }
      ).cancelIdleCallback;
      if (idleId && typeof cancelIdle === "function") {
        cancelIdle(idleId);
      }
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
    };
  }, [isLowEndDevice, isMobileViewport]);

  if (loading) {
    return <HeroSectionSkeleton />;
  }

  // Default hero images nếu không có data từ API
  const defaultImages = [
    {
      id: "default-1",
      title: "Starbucks Collection Card 2",
      imageUrl:
        "https://starbucks-shop.s3.ap-southeast-1.amazonaws.com/uploads/HASRON-+CARD-2.webp",
      altText: "Starbucks Collection Card 2",
      order: 0,
      isActive: true,
    },
    {
      id: "default-2",
      title: "Starbucks Collection Card 1",
      imageUrl:
        "https://starbucks-shop.s3.ap-southeast-1.amazonaws.com/uploads/HASRON-+CARD-1.webp",
      altText: "Starbucks Collection Card 1",
      order: 1,
      isActive: true,
    },
  ];

  const imagesToShow = heroImages.length > 0 ? heroImages : defaultImages;
  const activeImages = imagesToShow
    .filter((img) => img.isActive)
    .sort((a, b) => a.order - b.order);
  const primaryHeroImage = activeImages[0] || defaultImages[0];

  // Default banner data
  const defaultBanner = {
    title: "Bộ Sưu Tập",
    highlightText: "Ly Starbucks",
    highlightColor: "#10b981",
    description:
      "Khám phá bộ sưu tập ly Starbucks đa dạng với nhiều màu sắc và dung tích. Tư vấn miễn phí qua Messenger.",
    buttonText: "Khám Phá Ngay",
    buttonLink: "/products",
  };

  const bannerData = promotionalBanner || defaultBanner;

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left text card - Dynamic from promotional banner */}
          <div className="bg-zinc-900 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
            <div className="mb-4 md:mb-6">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {bannerData.title}
                {bannerData.highlightText && (
                  <>
                    <br />
                    <span
                      className="font-bold"
                      style={{ color: bannerData.highlightColor || "#10b981" }}
                    >
                      {bannerData.highlightText}
                    </span>
                  </>
                )}
              </h1>
            </div>
            <div
              className="text-gray-300 text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bannerData.description }}
            />
            <Link
              to={bannerData.buttonLink}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-300 w-fit text-sm md:text-base"
            >
              {bannerData.buttonText}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>

          {/* Hero carousel - lazy loaded sau first paint */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="h-64 md:h-96 lg:h-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900">
              {!showSwiper ? (
                <div className="relative h-full">
                  <OptimizedImage
                    src={primaryHeroImage.imageUrl}
                    alt={primaryHeroImage.altText}
                    fill
                    width={840}
                    className="object-contain"
                    priority
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 640px) 88vw, (max-width: 768px) 88vw, (max-width: 1024px) 56vw, 44vw"
                    quality={50}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <Suspense fallback={<SwiperFallback />}>
                  <SwiperCarousel images={activeImages} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
