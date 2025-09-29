"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper CSS
import "swiper/css";
import "swiper/css/pagination";

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
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        bulletClass: "swiper-pagination-bullet !bg-white/50",
        bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
      }}
      className="h-full"
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.id}>
          <div className="relative h-full w-full">
            <Image
              src={image.imageUrl}
              alt={image.altText}
              fill
              className="object-contain"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 60vw, 50vw"
              quality={85}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}