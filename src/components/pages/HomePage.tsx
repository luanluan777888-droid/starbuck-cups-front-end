import React from "react";
import { StructuredData } from "@/components/seo/StructuredData";

// Hero Section không lazy load để tối ưu LCP
import HeroSection from "@/components/home/HeroSection";

import DeferredHomeProductGrid from "@/components/home/DeferredHomeProductGrid";

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
  heroImages?: HeroImageData[];
  promotionalBanner?: PromotionalBannerData | null;
  loading?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  heroImages = [],
  promotionalBanner = null,
  loading = false,
}) => {
  return (
    <div className="min-h-screen bg-black text-white pt-12">
      {/* SEO Structured Data */}
      <StructuredData />

      {/* Hero Section - Không lazy load để tối ưu LCP */}
      <HeroSection
        loading={loading}
        heroImages={heroImages}
        promotionalBanner={promotionalBanner}
      />

      {/* Categories Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {/* product title*/}
          <h2 className="text-2xl font-semibold mb-6">Sản phẩm mới nhất</h2>

          {/* Products Grid (deferred to reduce initial main-thread cost) */}
          <DeferredHomeProductGrid selectedCategory={null} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
