import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import HomePageComponent from "@/components/pages/HomePage";
import { preload } from "react-dom";
import { convertDriveUrl } from "@/utils/googleDriveHelper";

// Enable static generation with revalidation for better performance
export const revalidate = 300; // 5 minutes
export const dynamic = "force-static";

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

interface HomePageProps {
  heroImages: HeroImageData[];
  promotionalBanner: PromotionalBannerData | null;
}

const HERO_IMAGE_SIZES =
  "(max-width: 640px) 88vw, (max-width: 768px) 88vw, (max-width: 1024px) 56vw, 44vw";

function buildOptimizedImageUrl(src: string, width: number, quality = 50): string {
  const convertedSrc = convertDriveUrl(src);

  if (convertedSrc.startsWith("/") || convertedSrc.startsWith("data:")) {
    return convertedSrc;
  }

  const params = new URLSearchParams();
  params.set("url", convertedSrc);
  params.set("w", String(width));
  params.set("q", String(quality));
  params.set("f", "auto");
  return `/api/image?${params.toString()}`;
}

export const metadata: Metadata = generateSEO({
  title: "Trang chủ",
  description:
    "Ly ST@RBUCKS CHÍNH HÃNG các nước. 95% MẪU TRÊN PAGE là HÀNG SẴN SHIP HOẢ TỐC📍HCM📍 Quà tặng cao cấp Luxury. Có dịch vụ gói quà. FB: Hasron Leung. Dịch vụ ship hoả tốc 24/7",
  keywords:
    "ly starbucks, tumbler starbucks, cốc starbucks, ly giữ nhiệt, starbucks vietnam, mua ly starbucks, ly gai starbucks, shoucangpu, hasron.com, hasron, hasron starbucks chính hãng, hasron starbucks, hasron ly starbucks chính hãng, h's, h's shoucangpu, hasron leung",
  openGraph: {
    title: "H’s shoucangpu - Trang chủ",
    description:
      "Ly ST@RBUCKS CHÍNH HÃNG các nước. 95% MẪU TRÊN PAGE là HÀNG SẴN SHIP HOẢ TỐC📍HCM📍 Quà tặng cao cấp Luxury. Có dịch vụ gói quà. FB: Hasron Leung",
    image: "/images/placeholder.webp",
    url: "/",
    type: "website",
  },
});

// Server-side data fetching
async function getHomePageData(): Promise<HomePageProps> {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api-starbuck-cups.lequangtridat.com/api";

  const timedFetch = async (url: string, revalidateValue: number) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    try {
      const response = await fetch(url, {
        next: { revalidate: revalidateValue },
        cache: "force-cache",
        signal: controller.signal,
      });

      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    let heroImages: HeroImageData[] = [];
    let promotionalBanner: PromotionalBannerData | null = null;
    // Fetch critical hero data in parallel to reduce TTFB.
    const [heroImagesData, bannerData] = await Promise.all([
      timedFetch(`${apiBaseUrl}/hero-images/public`, 300),
      timedFetch(`${apiBaseUrl}/promotional-banners`, 120),
    ]);

    if (heroImagesData?.success && heroImagesData.data) {
      heroImages = heroImagesData.data;
    }

    if (bannerData?.success && bannerData.data) {
      promotionalBanner = bannerData.data;
    }

    return {
      heroImages,
      promotionalBanner,
    };
  } catch {
    return {
      heroImages: [],
      promotionalBanner: null,
    };
  }
}

export default async function HomePage() {
  const homePageData = await getHomePageData();
  const heroImages = homePageData.heroImages || [];
  const lcpHeroImage = heroImages.find((img) => img.isActive) || heroImages[0];

  if (lcpHeroImage?.imageUrl) {
    const lcpImageSrc = buildOptimizedImageUrl(lcpHeroImage.imageUrl, 840, 50);
    const lcpImageSrcSet = [360, 384, 420, 480, 540, 640, 720, 768, 840]
      .map(
        (width) =>
          `${buildOptimizedImageUrl(lcpHeroImage.imageUrl, width, 50)} ${width}w`
      )
      .join(", ");

    preload(lcpImageSrc, {
      as: "image",
      imageSrcSet: lcpImageSrcSet,
      imageSizes: HERO_IMAGE_SIZES,
      fetchPriority: "high",
    });
  }

  return (
    <HomePageComponent
      heroImages={heroImages}
      promotionalBanner={homePageData.promotionalBanner}
    />
  );
}
