import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hasron.vn";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
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

  // Fetch dynamic product pages from API
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(`${apiUrl}/products/public?limit=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        "User-Agent": "Sitemap Generator",
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success && data.data && data.data.items) {
        // Backend trả về: data.data.items là array chứa products
        const products = data.data.items;

        if (Array.isArray(products)) {
          productPages = products.map(
            (product: { slug: string; createdAt: string }) => ({
              url: `${baseUrl}/products/${product.slug}`,
              lastModified: new Date(product.createdAt),
              changeFrequency: "weekly" as const,
              priority: 0.8,
            })
          );
          console.log(
            `Generated ${productPages.length} product pages for sitemap`
          );
        } else {
          console.warn(
            "data.data.items is not an array:",
            typeof products,
            products
          );
        }
      } else {
        console.warn("API response unsuccessful or no data.items:", data);
      }
    } else {
      console.error(
        "API response not ok:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // Fallback to empty array if API fails
  }

  return [...staticPages, ...productPages];
}
