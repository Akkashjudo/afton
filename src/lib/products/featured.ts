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

/**
 * Hero equipment — Afton's OWN brand only. The main hero must never showcase a
 * competing brand (Sole/Spirit/etc.). A curated slug is preferred for a clean,
 * isolated, high-resolution shot; if it's ever missing, we fall back to the
 * best-photographed Afton treadmill, then any well-photographed Afton cardio
 * piece — still always brand "Afton".
 */
const HERO_PREFERRED_SLUGS = [
  "afton-bt30-ac-motorised-treadmill",
  "afton-bt14-motorised-treadmill",
  "afton-bt16-motorised-treadmill",
];

export function pickHeroProduct(): Product | undefined {
  const all = getAllProducts();
  const isAfton = (p: Product) => p.brandSlug === "afton";

  for (const slug of HERO_PREFERRED_SLUGS) {
    const match = all.find((p) => p.slug === slug && p.image_count > 0);
    if (match) return match;
  }

  const aftonTreadmills = all.filter((p) => isAfton(p) && /treadmill/i.test(p.product_name));
  const aftonCardio = all.filter(
    (p) => isAfton(p) && /treadmill|elliptical|bike|rower|cross trainer/i.test(p.product_name),
  );
  return (
    bestPhotographed(aftonTreadmills) ??
    bestPhotographed(aftonCardio) ??
    bestPhotographed(all.filter(isAfton))
  );
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
