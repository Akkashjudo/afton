import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";
import { buildAltText } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

function parseSpecs(specs: string[], limit: number) {
  return specs
    .map((s) => {
      const i = s.indexOf(":");
      return i > 0 && i < 40
        ? { label: s.slice(0, i).trim(), value: s.slice(i + 1).trim() }
        : null;
    })
    .filter((x): x is { label: string; value: string } => x !== null)
    .slice(0, limit);
}

export function FeaturedEquipment({ products }: { products: Product[] }) {
  return (
    <section className="section-gap border-t border-outline-variant">
      <div className="container-afton space-y-24 md:space-y-32">
        {products.map((product, index) => {
          const image = product.local_images[0];
          const reversed = index % 2 === 1;
          const specs = parseSpecs(product.specifications, 2);
          const badge = index === 0 ? "BEST SELLER" : product.brand?.toUpperCase() ?? "FEATURED";

          return (
            <Reveal key={product.slug}>
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div
                  className={cn(
                    "flex aspect-square items-center justify-center bg-technical p-12",
                    reversed && "lg:order-2",
                  )}
                >
                  {image && (
                    <Image
                      src={image.localPath}
                      alt={buildAltText(product.product_name, 0)}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 1024px) 46vw, 90vw"
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                <div className={cn(reversed && "lg:order-1")}>
                  <span className="t-label mb-6 inline-block bg-surface-highest px-3 py-1 text-accent">
                    {badge}
                  </span>
                  <h2 className="t-headline-lg mb-6 text-primary">{product.product_name}</h2>
                  {product.description_text && (
                    <p className="t-body-lg mb-8 line-clamp-3 text-on-surface-variant">
                      {product.description_text}
                    </p>
                  )}

                  {specs.length > 0 && (
                    <div className="mb-10 border-y border-outline-variant py-6">
                      <div className="grid grid-cols-2 gap-8">
                        {specs.map((spec) => (
                          <div key={spec.label}>
                            <span className="t-label text-on-surface-variant">{spec.label}</span>
                            <p className="mt-1 font-body font-semibold">{spec.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex items-center gap-3 bg-primary px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent"
                    >
                      View Product
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={`/product/${product.slug}#specs`}
                      className="flex items-center border border-outline px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-surface-container"
                    >
                      Specifications
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
