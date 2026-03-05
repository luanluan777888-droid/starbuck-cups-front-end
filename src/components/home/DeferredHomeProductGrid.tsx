import React, { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";

const HomeProductGrid = React.lazy(() => import("@/components/HomeProductGrid"));

interface DeferredHomeProductGridProps {
  selectedCategory?: string | null;
}

export default function DeferredHomeProductGrid({
  selectedCategory = null,
}: DeferredHomeProductGridProps) {
  const [shouldMountGrid, setShouldMountGrid] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldMountGrid) return;

    let mounted = true;
    let fallbackTimer: number | undefined;
    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const run = () => {
      if (!mounted) return;
      setShouldMountGrid(true);
    };

    const schedule = () => {
      const requestIdle = (
        window as Window & {
          requestIdleCallback?: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions
          ) => number;
        }
      ).requestIdleCallback;

      if (typeof requestIdle === "function") {
        idleId = requestIdle(() => run(), { timeout: 1200 });
        return;
      }

      timeoutId = window.setTimeout(run, 400);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        schedule();
      },
      { rootMargin: "260px 0px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    fallbackTimer = window.setTimeout(schedule, 2500);

    return () => {
      mounted = false;
      observer.disconnect();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (timeoutId) window.clearTimeout(timeoutId);

      const cancelIdle = (
        window as Window & {
          cancelIdleCallback?: (handle: number) => void;
        }
      ).cancelIdleCallback;
      if (idleId && typeof cancelIdle === "function") {
        cancelIdle(idleId);
      }
    };
  }, [shouldMountGrid]);

  return (
    <div ref={sentinelRef}>
      {shouldMountGrid ? (
        <Suspense fallback={<ProductGridSkeleton />}>
          <HomeProductGrid selectedCategory={selectedCategory} />
        </Suspense>
      ) : (
        <ProductGridSkeleton />
      )}
    </div>
  );
}
