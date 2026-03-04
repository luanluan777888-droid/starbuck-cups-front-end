"use client";

import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import OptimizedImage from "@/components/OptimizedImage";
import styles from "./SwiperStyles.module.css";

interface HeroImageData {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  order: number;
  isActive: boolean;
}

interface SwiperCarouselProps {
  images: HeroImageData[];
}

export default function SwiperCarousel({ images }: SwiperCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const eagerIndexes = useMemo(() => {
    const indexes = new Set<number>([activeIndex]);
    if (images.length > 1) {
      indexes.add((activeIndex + 1) % images.length);
      indexes.add((activeIndex - 1 + images.length) % images.length);
    }
    return indexes;
  }, [activeIndex, images.length]);

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      pagination={{
        clickable: true,
        bulletClass: "swiper-pagination-bullet !bg-white/50",
        bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
      }}
      className={`h-full ${styles.swiperScope}`}
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.id}>
          <div className="relative h-full w-full">
            {eagerIndexes.has(index) ? (
              <OptimizedImage
                src={image.imageUrl}
                alt={image.altText}
                fill
                width={840}
                className="object-contain"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                sizes="(max-width: 640px) 88vw, (max-width: 768px) 88vw, (max-width: 1024px) 56vw, 44vw"
                quality={50}
                style={{ objectFit: "contain" }}
              />
            ) : null}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
