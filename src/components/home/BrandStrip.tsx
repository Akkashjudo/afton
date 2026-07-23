import Link from "next/link";
import type { BrandSummary } from "@/types/product";

/** Wordmark strip of confirmed brands — greyscale, warms up on hover. */
export function BrandStrip({ brands }: { brands: BrandSummary[] }) {
  return (
    <section className="border-y border-outline-variant bg-white py-12">
      <div className="container-afton">
        <div className="flex flex-wrap items-center justify-between gap-8 opacity-60 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="font-display text-2xl font-black uppercase tracking-tight text-primary transition-colors hover:text-accent"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
