import { PageSEO, Product } from "@/types";

export const siteConfig = {
  name: "H's shoucangpu - Collectible Gift Shop",
  description:
    "Ly ST@RBUCKS CHÍNH HÃNG các nước. 95% MẪU TRÊN PAGE là HÀNG SẴN SHIP HOẢ TỐC📍HCM📍 Quà tặng cao cấp Luxury. Có dịch vụ gói quà. FB: Hasron Leung. Dịch vụ ship hoả tốc 24/7",
  url: import.meta.env.VITE_SITE_URL || "https://starbucks-cups.com",
  image: "/logo.png",
  keywords:
    "starbucks, ly starbucks, cups, tumbler, ly giữ nhiệt, starbucks vietnam, ly starbucks chính hãng, ly starbuck chính hãng, ly starbucks auth, starbuck chính hãng, starbucks chính hãng, mua ly starbuck chính hãng, bình starbucks chính hãng, bình giữ nhiệt starbucks, ly giữ nhiệt starbucks, ly sứ starbucks",
};

export function generateSEO(seo: Partial<PageSEO>) {
  const title = seo.title
    ? `${seo.title} | ${siteConfig.name}`
    : siteConfig.name;
  const description = seo.description || siteConfig.description;
  const url = seo.canonical || siteConfig.url;
  const image = seo.openGraph?.image || siteConfig.image;

  return {
    title,
    description,
    keywords: seo.keywords || siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: seo.openGraph?.title || title,
      description: seo.openGraph?.description || description,
      url: seo.openGraph?.url || url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: seo.openGraph?.title || title,
        },
      ],
      locale: "vi_VN",
      type: seo.openGraph?.type || "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.openGraph?.title || title,
      description: seo.openGraph?.description || description,
      images: [image],
      creator: "@starbuckscups",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION,
      yandex: import.meta.env.VITE_YANDEX_VERIFICATION,
    },
  };
}

export function generateProductStructuredData(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.productImages?.map(
      (img: { url: string }) => `${siteConfig.url}${img.url}`
    ),
    brand: {
      "@type": "Brand",
      name: "Starbucks",
    },
    category:
      product.productCategories
        ?.map((pc: { category: { name: string } }) => pc.category.name)
        .join(", ") || "",
    color:
      product.productColors
        ?.map((pc: { color: { name: string } }) => pc.color.name)
        .join(", ") || "",
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/InStock",
      priceCurrency: "VND",
      lowPrice: "0",
      highPrice: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        valueAddedTaxIncluded: true,
      },
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "100",
    },
  };
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Vietnamese",
    },
    sameAs: [
      "https://facebook.com/starbuckscups",
      "https://instagram.com/starbuckscups",
    ],
  };
}
