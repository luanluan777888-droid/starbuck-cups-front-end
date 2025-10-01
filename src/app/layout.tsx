import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import { generateSEO, generateOrganizationStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  ...generateSEO({
    title: "H's shoucangpu - Collectible Gift Shop",
    description:
      "Khám phá bộ sưu tập ly St@rbucks đa dạng với nhiều màu sắc và dung tích. Tư vấn miễn phí qua Zalo 0896686008.",
    keywords:
      "starbucks, ly starbucks, cups, tumbler, ly giữ nhiệt, starbucks vietnam",
    openGraph: {
      title: "H's shoucangpu - Collectible Gift Shop",
      description:
        "Khám phá bộ sưu tập ly St@rbucks đa dạng với nhiều màu sắc và dung tích",
      image: "/logo.png",
      url: "/",
      type: "website",
    },
  }),
  twitter: {
    card: "summary",
    title: "H's shoucangpu - Cửa hàng ly St@rbucks",
    description:
      "Khám phá bộ sưu tập ly St@rbucks đa dạng với nhiều màu sắc và dung tích",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationData = generateOrganizationStructuredData();
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

  const awsS3Url = process.env.NEXT_PUBLIC_AWS_S3_URL;

  return (
    <html lang="vi">
      <head>
        {/* Dynamic AWS resource hints nếu có */}
        {awsS3Url && (
          <>
            <link rel="preconnect" href={awsS3Url} />
            <link rel="dns-prefetch" href={awsS3Url} />
          </>
        )}

        {/* Preload critical fonts để tối ưu LCP */}
        <link
          rel="preload"
          href="/font/JetBrainsMono-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/JetBrainsMono-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Optimize viewport for mobile performance */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />

        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {/* Google Analytics 4 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_title: document.title,
                page_location: window.location.href,
                anonymize_ip: true,
                allow_google_signals: false,
                cookie_flags: 'SameSite=None;Secure'
              });
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
      </head>
      <body>
        <StoreProvider>
          <ClientLayout>{children}</ClientLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
