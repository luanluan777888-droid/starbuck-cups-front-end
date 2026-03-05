type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

export default async function sitemap(): Promise<SitemapEntry[]> {
  const baseUrl = import.meta.env.VITE_SITE_URL || "https://hasron.vn";
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let productPages: SitemapEntry[] = [];

  try {
    const response = await fetch(`${apiUrl}/products/public?limit=100`, {
      headers: {
        "User-Agent": "Sitemap Generator",
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success && data.data && data.data.items) {
        const products = data.data.items;

        if (Array.isArray(products)) {
          productPages = products.map(
            (product: { slug: string; createdAt: string }) => ({
              url: `${baseUrl}/products/${product.slug}`,
              lastModified: new Date(product.createdAt),
              changeFrequency: "weekly",
              priority: 0.8,
            })
          );
        }
      }
    }
  } catch {
    // Keep only static entries when product fetch fails.
  }

  return [...staticPages, ...productPages];
}
