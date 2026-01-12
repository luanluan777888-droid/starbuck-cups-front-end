"use client";

import React from "react";

interface FeaturedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FeaturedBadge({
  size = "md",
  className = "",
}: FeaturedBadgeProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`inline-block featured-shimmer ${className}`}>
      <span className={`${sizes[size]} featured-pulse`}>⭐</span>

      <style jsx>{`
        .featured-pulse {
          animation: featured-pulse 1.5s infinite;
        }

        .featured-shimmer {
          position: relative;
          overflow: hidden !important;
          isolation: isolate;
        }

        .featured-shimmer::before {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 255, 255, 0.8) 45%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.8) 55%,
            transparent 65%,
            transparent 100%
          );
          animation: featured-shimmer-sweep 2.5s infinite;
          z-index: 2;
          pointer-events: none;
        }

        @keyframes featured-pulse {
          0%,
          100% {
            filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(251, 191, 36, 1))
              drop-shadow(0 0 25px rgba(251, 191, 36, 0.8));
          }
        }

        @keyframes featured-shimmer-sweep {
          0% {
            transform: translateX(-70%) skewX(-15deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(70%) skewX(-15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Conditional Featured Badge - only shows if product is featured
interface ConditionalFeaturedBadgeProps extends FeaturedBadgeProps {
  product: { isFeatured?: boolean };
}

export function ConditionalFeaturedBadge({
  product,
  ...badgeProps
}: ConditionalFeaturedBadgeProps) {
  if (!product.isFeatured) {
    return null;
  }

  return <FeaturedBadge {...badgeProps} />;
}
