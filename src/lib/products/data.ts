import "server-only";
import rawProducts from "@/data/products.json";
import {
  ProductSchema,
  type BrandSummary,
  type CategorySummary,
  type Product,
} from "@/types/product";

let cachedProducts: Product[] | null = null;

/** All products, validated once per server process. */
export function getAllProducts(): Product[] {
  if (!cachedProducts) {
    cachedProducts = (rawProducts as unknown[]).map((p) => ProductSchema.parse(p));
  }
  return cachedProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(
  categorySlug: string,
  subcategorySlug?: string,
): Product[] {
  return getAllProducts().filter(
    (p) =>
      p.categorySlug === categorySlug &&
      (!subcategorySlug || p.subcategorySlug === subcategorySlug),
  );
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return getAllProducts().filter((p) => p.brandSlug === brandSlug);
}

/** Same-category first, padded out with same-brand products, excluding itself. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const pool = getAllProducts().filter((p) => p.slug !== product.slug);
  const sameCategory = pool.filter((p) => p.categorySlug === product.categorySlug);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const seen = new Set(sameCategory.map((p) => p.slug));
  const sameBrand = pool.filter(
    (p) => p.brandSlug === product.brandSlug && !seen.has(p.slug),
  );
  return [...sameCategory, ...sameBrand].slice(0, limit);
}

let cachedCategories: CategorySummary[] | null = null;

/** Real category/subcategory taxonomy, derived from the cleaned catalogue — not hand-guessed. */
export function getCategories(): CategorySummary[] {
  if (cachedCategories) return cachedCategories;

  type MutableCategory = {
    name: string;
    slug: string;
    count: number;
    subcategories: Map<string, { name: string; slug: string; count: number }>;
  };
  const map = new Map<string, MutableCategory>();

  for (const p of getAllProducts()) {
    if (!p.category || !p.categorySlug) continue;
    if (!map.has(p.categorySlug)) {
      map.set(p.categorySlug, {
        name: p.category,
        slug: p.categorySlug,
        count: 0,
        subcategories: new Map(),
      });
    }
    const entry = map.get(p.categorySlug)!;
    entry.count += 1;

    if (p.subcategory && p.subcategorySlug) {
      if (!entry.subcategories.has(p.subcategorySlug)) {
        entry.subcategories.set(p.subcategorySlug, {
          name: p.subcategory,
          slug: p.subcategorySlug,
          count: 0,
        });
      }
      entry.subcategories.get(p.subcategorySlug)!.count += 1;
    }
  }

  cachedCategories = [...map.values()]
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c.count,
      subcategories: [...c.subcategories.values()].sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);

  return cachedCategories;
}

let cachedBrands: BrandSummary[] | null = null;

export function getBrands(): BrandSummary[] {
  if (cachedBrands) return cachedBrands;

  const map = new Map<string, BrandSummary>();
  for (const p of getAllProducts()) {
    if (!p.brand || !p.brandSlug) continue;
    if (!map.has(p.brandSlug)) map.set(p.brandSlug, { name: p.brand, slug: p.brandSlug, count: 0 });
    map.get(p.brandSlug)!.count += 1;
  }
  cachedBrands = [...map.values()].sort((a, b) => b.count - a.count);
  return cachedBrands;
}

export function getCategoryBySlug(categorySlug: string): CategorySummary | undefined {
  return getCategories().find((c) => c.slug === categorySlug);
}

export function getBrandBySlug(brandSlug: string): BrandSummary | undefined {
  return getBrands().find((b) => b.slug === brandSlug);
}
