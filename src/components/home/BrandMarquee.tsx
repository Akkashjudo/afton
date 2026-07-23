import Link from "next/link";
import type { BrandSummary } from "@/types/product";

/**
 * Seamless infinite brand marquee.
 *
 * The track holds the brand list twice and translates exactly -50%, so the
 * second copy lands precisely where the first began — no visible jump. It's a
 * pure CSS animation (compositor-friendly `transform` only, no JS scroll
 * listener), pauses on hover, and is disabled under prefers-reduced-motion,
 * where it degrades to a normal horizontally-scrollable strip.
 */
export function BrandMarquee({ brands }: { brands: BrandSummary[] }) {
  if (brands.length === 0) return null;
  const track = [...brands, ...brands];

  return (
    <section
      aria-label="Brands available at Afton Fitness"
      className="border-y border-outline-variant bg-white py-10"
    >
      <div className="marquee-mask group relative overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-16 px-8">
          {track.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              href={`/brand/${brand.slug}`}
              aria-hidden={i >= brands.length}
              tabIndex={i >= brands.length ? -1 : undefined}
              className="flex min-h-[44px] shrink-0 items-center font-display text-xl font-black uppercase tracking-tight text-on-surface-variant transition-colors duration-300 hover:text-primary md:text-2xl"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
