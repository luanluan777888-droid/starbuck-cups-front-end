type Robots = {
  rules: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
  }>;
  sitemap: string;
};

export default function robots(): Robots {
  const baseUrl =
    import.meta.env.VITE_SITE_URL || "https://starbucks-cups.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/*"],
        disallow: ["/admin/*", "/api/*", "/_next/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
