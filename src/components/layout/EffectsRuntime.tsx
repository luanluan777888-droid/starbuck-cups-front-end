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
    const run = () => setIsReady(true);
    const idleApi = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number }
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleApi.requestIdleCallback && idleApi.cancelIdleCallback) {
      const idleId = idleApi.requestIdleCallback(run, { timeout: 1500 });
      return () => idleApi.cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(run, 1000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isReady) return null;

  return (
    <SettingsSocketProvider>
      <EffectManager />
    </SettingsSocketProvider>
  );
}

