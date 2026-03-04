"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SettingsSocketProvider = dynamic(
  () =>
    import("@/components/providers/SettingsSocketProvider").then((mod) => ({
      default: mod.SettingsSocketProvider,
    })),
  { ssr: false }
);

const EffectManager = dynamic(() => import("@/components/effects/EffectManager"), {
  ssr: false,
});

export default function EffectsRuntime() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const memory = nav.deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    const shouldSkipEffects = isMobile || prefersReducedMotion || memory <= 4 || cores <= 4;

    if (shouldSkipEffects) return;

    let timeoutId: number | undefined;
    let idleId: number | undefined;
    let armed = false;

    const run = () => {
      if (armed) return;
      armed = true;
      setIsReady(true);
    };

    const schedule = () => {
      const requestIdle = (
        window as Window & {
          requestIdleCallback?: (
            callback: () => void,
            options?: { timeout: number }
          ) => number;
        }
      ).requestIdleCallback;

      if (typeof requestIdle === "function") {
        idleId = requestIdle(run, { timeout: 2500 });
        return;
      }
      timeoutId = window.setTimeout(run, 1400);
    };

    const interactionEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "wheel",
    ];

    const onFirstInteraction = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onFirstInteraction);
      });
      schedule();
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, onFirstInteraction, { passive: true });
    });

    const fallbackTimer = window.setTimeout(schedule, 10000);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (timeoutId) window.clearTimeout(timeoutId);
      const cancelIdle = (
        window as Window & {
          cancelIdleCallback?: (handle: number) => void;
        }
      ).cancelIdleCallback;
      if (idleId && typeof cancelIdle === "function") {
        cancelIdle(idleId);
      }
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onFirstInteraction);
      });
    };
  }, []);

  if (!isReady) return null;

  return (
    <SettingsSocketProvider>
      <EffectManager />
    </SettingsSocketProvider>
  );
}
