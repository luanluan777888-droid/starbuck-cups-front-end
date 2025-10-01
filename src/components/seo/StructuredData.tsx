import Script from "next/script";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Starbucks Cups Shop",
    description:
      "Cửa hàng ly Starbucks chính thức với đa dạng màu sắc và dung tích. Tư vấn miễn phí qua Messenger.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://starbucks-cups.com",
    logo: {
      "@type": "ImageObject",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://starbucks-cups.com"
      }/logo.png`,
      width: "200",
      height: "200",
    },
    image: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://starbucks-cups.com"
    }/logo.png`,
    sameAs: [
      "https://www.facebook.com/starbuckscupsshop",
      "https://www.instagram.com/starbuckscupsshop",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ly Starbucks",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Ly Starbucks Tumbler",
            category: "Drinkware",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: "₫₫",
    currenciesAccepted: "VND",
    paymentAccepted: ["Cash", "Bank Transfer", "COD"],
    areaServed: {
      "@type": "Country",
      name: "Vietnam",
    },
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
