import type { Product, ProductSummary } from "@/types/product";

const SKU_KEYS = /^(model(\s*(no|number|name))?|item\s*(no|code)|sku|product\s*code)$/i;

/**
 * Reads a model/SKU out of the product's own specification lines
 * (e.g. "Model No: XT185"). Returns null when the source data doesn't state
 * one — nothing is generated or guessed.
 */
export function extractSku(product: Product): string | null {
  for (const spec of product.specifications) {
    const i = spec.indexOf(":");
    if (i <= 0 || i > 40) continue;
    const key = spec.slice(0, i).trim();
    const value = spec.slice(i + 1).trim();
    if (SKU_KEYS.test(key) && value && value.length <= 60) return value;
  }
  return null;
}

/** Trims a full product record down to what a product-grid card needs, so
 * client components (filters, browse grids) don't ship full descriptions/
 * specifications/etc. to the browser just to render a thumbnail. */
export function toProductSummary(product: Product): ProductSummary {
  return {
    slug: product.slug,
    product_name: product.product_name,
    brand: product.brand,
    brandSlug: product.brandSlug,
    category: product.category,
    categorySlug: product.categorySlug,
    subcategory: product.subcategory,
    subcategorySlug: product.subcategorySlug,
    product_url: product.product_url,
    image_count: product.image_count,
    primaryImage: product.local_images[0],
    sku: extractSku(product),
  };
}

/**
 * Even lighter shape for the header search index, which ships for every
 * product on every page — drops the extra taxonomy slugs and SKU, and keeps a
 * single small thumbnail reference.
 */
export function toSearchEntry(product: Product): ProductSummary {
  const img = product.local_images[0];
  return {
    slug: product.slug,
    product_name: product.product_name,
    brand: product.brand,
    brandSlug: null,
    category: product.category,
    categorySlug: null,
    subcategory: null,
    subcategorySlug: null,
    product_url: product.product_url,
    image_count: product.image_count,
    primaryImage: img ? { ...img, sourceUrl: null, fileSizeBytes: 0 } : undefined,
    sku: null,
  };
}
