import { useEffect, useState } from "react";
import HomePageView from "@/components/pages/HomePage";

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

export default function HomePage() {
  const [heroImages, setHeroImages] = useState<HeroImageData[]>([]);
  const [promotionalBanner, setPromotionalBanner] =
    useState<PromotionalBannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchHomeData = async () => {
      try {
        const [heroImagesResponse, bannerResponse] = await Promise.all([
          fetch("/api/hero-images/public"),
          fetch("/api/promotional-banners"),
        ]);

        if (heroImagesResponse.ok) {
          const heroImagesPayload = await heroImagesResponse.json();
          if (
            mounted &&
            heroImagesPayload?.success &&
            Array.isArray(heroImagesPayload.data)
          ) {
            setHeroImages(heroImagesPayload.data);
          }
        }

        if (bannerResponse.ok) {
          const bannerPayload = await bannerResponse.json();
          if (mounted && bannerPayload?.success && bannerPayload.data) {
            setPromotionalBanner(bannerPayload.data);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <HomePageView
      heroImages={heroImages}
      promotionalBanner={promotionalBanner}
      loading={loading}
    />
  );
}
