import "server-only";
import { getAllProducts, getProductsByCategory } from "./data";
import type { Product } from "@/types/product";

/** Best-photographed product in a set (most images, full-res preferred). */
function bestPhotographed(products: Product[]): Product | undefined {
  return [...products]
    .filter((p) => p.image_count > 0)
    .sort((a, b) => {
      const aLow = a.local_images[0]?.lowResolutionFallback ? 1 : 0;
      const bLow = b.local_images[0]?.lowResolutionFallback ? 1 : 0;
      if (aLow !== bLow) return aLow - bLow;
      return b.image_count - a.image_count;
    })[0];
}

export function pickHeroProduct(): Product | undefined {
  const treadmills = getAllProducts().filter((p) => /treadmill/i.test(p.product_name));
  return bestPhotographed(treadmills) ?? bestPhotographed(getAllProducts());
}

export function pickCategoryImage(categorySlug: string): Product | undefined {
  return bestPhotographed(getProductsByCategory(categorySlug));
}

/** Distinct, well-photographed featured products across different categories. */
export function pickFeatured(count: number, excludeSlugs: string[] = []): Product[] {
  const exclude = new Set(excludeSlugs);
  const out: Product[] = [];
  const seenCategory = new Set<string>();

  const pool = getAllProducts()
    .filter((p) => p.image_count >= 2 && !exclude.has(p.slug))
    .sort((a, b) => b.image_count - a.image_count);

  for (const p of pool) {
    if (p.categorySlug && seenCategory.has(p.categorySlug)) continue;
    out.push(p);
    if (p.categorySlug) seenCategory.add(p.categorySlug);
    if (out.length >= count) break;
  }
  return out;
}
