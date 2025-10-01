import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import HomePageComponent from "@/components/pages/HomePage";
import { Category } from "@/types";

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
  categories: Category[];
  heroImages: HeroImageData[];
  promotionalBanner: PromotionalBannerData | null;
}

export const metadata: Metadata = generateSEO({
  title: "Trang chủ",
  description:
    "Khám phá bộ sưu tập ly Starbucks đa dạng với nhiều màu sắc và dung tích. Tư vấn miễn phí qua Messenger.",
  keywords:
    "ly starbucks, tumbler starbucks, cốc starbucks, ly giữ nhiệt, starbucks vietnam, mua ly starbucks, ly gai starbucks, shoucangpu",
  openGraph: {
    title: "H’s shoucangpu - Trang chủ",
    description:
      "Khám phá bộ sưu tập ly Starbucks đa dạng với nhiều màu sắc và dung tích. Giao hàng toàn quốc.",
    image: "/images/placeholder.png",
    url: "/",
    type: "website",
  },
});

// Server-side data fetching
async function getHomePageData(): Promise<HomePageProps> {
  try {
    // Fetch categories from API
    const categoriesResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api-starbuck-cups.lequangtridat.com/api"
      }/categories/public/`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
        cache: "force-cache",
      }
    );
    console.log("Fetched categories response:", categoriesResponse);

    let categories: Category[] = [];

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log("Fetched categories data:", categoriesData);
      if (categoriesData.success && categoriesData.data?.items) {
        categories = categoriesData.data.items;
      }
    }

    // Fetch hero images from API
    let heroImages: HeroImageData[] = [];
    try {
      const heroImagesUrl = `${
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api-starbuck-cups.lequangtridat.com/api"
      }/hero-images/public`;

      console.log("🔗 Hero images URL:", heroImagesUrl);

      const heroImagesResponse = await fetch(heroImagesUrl, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
        cache: "force-cache",
      });
      console.log(
        "📡 Fetched hero images response:",
        heroImagesResponse.status,
        heroImagesResponse.statusText
      );

      if (heroImagesResponse.ok) {
        const heroImagesData = await heroImagesResponse.json();
        console.log("✅ Fetched hero images data:", heroImagesData);
        console.log("✅ Hero images count:", heroImagesData.data?.length || 0);
        if (heroImagesData.success && heroImagesData.data) {
          heroImages = heroImagesData.data;
        }
      } else {
        console.error(
          "❌ Hero images API failed:",
          heroImagesResponse.status,
          heroImagesResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching hero images:", error);
    }

    // Fetch promotional banner from API
    let promotionalBanner: PromotionalBannerData | null = null;
    try {
      const bannerUrl = `${
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api-starbuck-cups.lequangtridat.com/api"
      }/promotional-banners`;

      console.log("🔗 Promotional banner URL:", bannerUrl);

      const bannerResponse = await fetch(bannerUrl, {
        next: { revalidate: 60 }, // Revalidate every 1 minute for promotional content
        cache: "force-cache",
      });

      console.log(
        "📡 Fetched promotional banner response:",
        bannerResponse.status
      );

      if (bannerResponse.ok) {
        const bannerData = await bannerResponse.json();
        console.log("✅ Fetched promotional banner data:", bannerData);
        if (bannerData.success && bannerData.data) {
          promotionalBanner = bannerData.data;
        }
      } else {
        console.error(
          "❌ Promotional banner API failed:",
          bannerResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching promotional banner:", error);
    }

    return {
      categories,
      heroImages,
      promotionalBanner,
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return {
      categories: [],
      heroImages: [],
      promotionalBanner: null,
    };
  }
}

export default async function HomePage() {
  const homePageData = await getHomePageData();

  return (
    <HomePageComponent
      categories={homePageData.categories || []}
      heroImages={homePageData.heroImages || []}
      promotionalBanner={homePageData.promotionalBanner}
    />
  );
}
