import type { LocalImage, Product } from "@/types/product";

/**
 * Alt text from real data only — we don't know the camera angle, so gallery
 * images get a neutral "product image N" suffix instead of a fabricated
 * "side view" / "front view" claim.
 */
export function buildAltText(productName: string, index: number): string {
  return index === 0 ? productName : `${productName} — product image ${index + 1}`;
}

export function getPrimaryImage(product: Product): LocalImage | undefined {
  return product.local_images[0];
}

export function hasOnlyLowResImages(product: Product): boolean {
  return (
    product.local_images.length > 0 &&
    product.local_images.every((img) => img.lowResolutionFallback)
  );
}
