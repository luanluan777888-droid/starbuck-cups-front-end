import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

interface DeferredGoogleAnalyticsProps {
  measurementId: string;
}

function isValidMeasurementId(measurementId: string): boolean {
  return (
    /^G-[A-Z0-9]+$/i.test(measurementId) && measurementId !== "G-XXXXXXXXXX"
  );
}

// Helper to inject script tags manually (replaces next/script)
function injectScript(id: string, src?: string, inline?: string, strategy?: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  if (src) s.src = src;
  if (inline) s.textContent = inline;
  s.async = true;
  document.head.appendChild(s);
}

export default function DeferredGoogleAnalytics({
  measurementId,
}: DeferredGoogleAnalyticsProps) {
  const pathname = useLocation().pathname;
  const [enabled, setEnabled] = useState(false);

  const shouldLoadAnalytics = useMemo(() => {
    if (import.meta.env.MODE !== "production") return false;
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

    const passiveOptions: AddEventListenerOptions = {
      once: true,
      passive: true,
    };

    window.addEventListener("pointerdown", enable, passiveOptions);
    window.addEventListener("keydown", enable, { once: true });
    window.addEventListener("scroll", enable, passiveOptions);

    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("scroll", enable);
    };
  }, [enabled, shouldLoadAnalytics]);

  useEffect(() => {
    if (!enabled || !shouldLoadAnalytics) return;

    injectScript(
      "ga-loader",
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    );

    injectScript(
      "ga-init",
      undefined,
      `
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
      `
    );
  }, [enabled, shouldLoadAnalytics, measurementId]);

  return null;
}
