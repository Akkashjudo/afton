"use client";

import { useEffect } from "react";
import type { ProductSummary } from "@/types/product";
import { recentlyViewedStore } from "@/lib/recently-viewed/store";

/** Records this product as viewed — writes to the external store as a side
 * effect (no local setState), so it doesn't run into the "no setState in
 * effect body" rule the enquiry store previously hit. */
export function RecentlyViewedTracker({ product }: { product: ProductSummary }) {
  useEffect(() => {
    recentlyViewedStore.track(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  return null;
}
