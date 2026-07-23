"use client";

import { useSyncExternalStore } from "react";
import { recentlyViewedStore } from "@/lib/recently-viewed/store";
import { ProductCard } from "./ProductCard";

export function RecentlyViewedList({ excludeSlug }: { excludeSlug: string }) {
  const items = useSyncExternalStore(
    recentlyViewedStore.subscribe,
    recentlyViewedStore.getSnapshot,
    recentlyViewedStore.getServerSnapshot,
  );

  const visible = items.filter((p) => p.slug !== excludeSlug).slice(0, 4);
  if (visible.length === 0) return null;

  return (
    <section className="border-t border-outline-variant py-16">
      <h2 className="t-headline-md mb-6 uppercase text-primary">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
