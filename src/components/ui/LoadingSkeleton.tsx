// Lightweight loading skeleton component without external dependencies
import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = "h-4 bg-zinc-800 rounded",
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`animate-pulse ${className}`} />
      ))}
    </>
  );
};

// Specific skeleton components
export const HeroSkeleton = () => (
  <div className="py-4 md:py-8">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="bg-zinc-900 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
          <LoadingSkeleton className="h-8 md:h-12 bg-zinc-800 rounded mb-4" />
          <LoadingSkeleton className="h-8 md:h-12 bg-zinc-800 rounded w-3/4 mb-6" />
          <LoadingSkeleton className="h-4 bg-zinc-700 rounded mb-2" count={3} />
          <LoadingSkeleton className="h-10 w-48 bg-zinc-600 rounded-full mt-4" />
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          <LoadingSkeleton className="h-48 md:h-64 lg:h-full bg-zinc-900 rounded-2xl md:rounded-3xl" />
        </div>
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }, (_, index) => (
      <div key={index} className="bg-zinc-900 rounded-xl overflow-hidden">
        <LoadingSkeleton className="h-48 bg-zinc-800" />
        <div className="p-4">
          <LoadingSkeleton className="h-5 bg-zinc-800 rounded mb-2" />
          <LoadingSkeleton className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
          <LoadingSkeleton className="h-6 bg-zinc-600 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
