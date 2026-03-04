"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

interface DeferredGoogleAnalyticsProps {
  measurementId: string;
}

function isValidMeasurementId(measurementId: string): boolean {
  return (
    /^G-[A-Z0-9]+$/i.test(measurementId) && measurementId !== "G-XXXXXXXXXX"
  );
}

export default function DeferredGoogleAnalytics({
  measurementId,
}: DeferredGoogleAnalyticsProps) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  const shouldLoadAnalytics = useMemo(() => {
    if (process.env.NODE_ENV !== "production") return false;
    if (!isValidMeasurementId(measurementId)) return false;
    if (pathname?.startsWith("/admin")) return false;
    return true;
  }, [measurementId, pathname]);

  useEffect(() => {
    if (!shouldLoadAnalytics) {
      setEnabled(false);
      return;
    }

    if (enabled) return;

    const enable = () => setEnabled(true);
    const fallbackTimer = window.setTimeout(enable, 12000);

    const passiveOptions: AddEventListenerOptions = {
      once: true,
      passive: true,
    };

    window.addEventListener("pointerdown", enable, passiveOptions);
    window.addEventListener("keydown", enable, { once: true });
    window.addEventListener("scroll", enable, passiveOptions);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("scroll", enable);
    };
  }, [enabled, shouldLoadAnalytics]);

  if (!enabled || !shouldLoadAnalytics) {
    return null;
  }

  return (
    <>
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true,
            allow_google_signals: false,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}

