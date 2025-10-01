"use client";

import React, { useState, lazy, Suspense } from "react";
import { Category } from "@/types";
import {
  ProductGridSkeleton,
  LoadingSkeleton,
} from "@/components/ui/LoadingSkeleton";
import { StructuredData } from "@/components/seo/StructuredData";

// Hero Section không lazy load để tối ưu LCP
import HeroSection from "@/components/home/HeroSection";

// Lazy load các components khác để giảm bundle size và TBT
const CategoryTabs = lazy(() =>
  import("@/components/home/CategoryTabs").then((module) => ({
    default: module.default,
  }))
);
const HomeProductGrid = lazy(() =>
  import("@/components/HomeProductGrid").then((module) => ({
    default: module.default,
  }))
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

interface HomePageProps {
  categories: Category[];
  heroImages?: HeroImageData[];
  promotionalBanner?: PromotionalBannerData | null;
  loading?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  categories,
  heroImages = [],
  promotionalBanner = null,
  loading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
  };

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
          <Suspense
            fallback={
              <LoadingSkeleton className="h-12 bg-zinc-800 rounded-lg mb-6" />
            }
          >
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              loading={loading}
            />
          </Suspense>

          {/* Products Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <HomeProductGrid selectedCategory={selectedCategory} />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
