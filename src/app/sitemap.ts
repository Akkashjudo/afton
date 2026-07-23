import type { MetadataRoute } from "next";
import { getAllProducts, getBrands, getCategories } from "@/lib/products";

const BASE_URL = "https://afton.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/products",
    "/brands",
    "/store-locator",
    "/about",
    "/contact",
    "/support",
    "/commercial-solutions",
    "/enquiry",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly" as const,
  }));

  const categoryRoutes = getCategories().flatMap((category) => [
    { url: `${BASE_URL}/category/${category.slug}`, changeFrequency: "weekly" as const },
    ...category.subcategories.map((sub) => ({
      url: `${BASE_URL}/category/${category.slug}/${sub.slug}`,
      changeFrequency: "weekly" as const,
    })),
  ]);

  const brandRoutes = getBrands().map((brand) => ({
    url: `${BASE_URL}/brand/${brand.slug}`,
    changeFrequency: "weekly" as const,
  }));

  const productRoutes = getAllProducts().map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
