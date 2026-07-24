"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProductSummary } from "@/types/product";
import { buildAltText } from "@/lib/images";

export function RelatedProducts({
  products,
  title = "Related Equipment",
}: {
  products: ProductSummary[];
  title?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scrollBy(dir: number) {
    scrollRef.current?.scrollBy({ left: dir * 350, behavior: "smooth" });
  }

  return (
    <section className="section-gap border-t border-outline-variant">
      <div className="container-afton">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="t-headline-lg uppercase text-primary">{title}</h2>
          <div className="hidden gap-4 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="flex h-11 w-11 items-center justify-center border border-outline-variant transition-colors hover:bg-surface-high"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="flex h-11 w-11 items-center justify-center border border-outline-variant transition-colors hover:bg-surface-high"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="hide-scrollbar flex snap-x gap-6 overflow-x-auto">
          {products.map((product) => (
            <div key={product.slug} className="group flex min-w-[280px] snap-start flex-col gap-4 sm:min-w-[320px]">
              <Link
                href={`/product/${product.slug}`}
                className="flex aspect-square items-center justify-center border border-outline-variant bg-surface-low p-6 transition-[transform,border-color] duration-300 ease-out will-change-transform group-hover:-translate-y-1.5 group-hover:border-primary motion-reduce:transform-none"
              >
                {product.primaryImage && (
                  <Image
                    src={product.primaryImage.localPath}
                    alt={buildAltText(product.product_name, 0)}
                    width={product.primaryImage.width}
                    height={product.primaryImage.height}
                    sizes="320px"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </Link>
              <div>
                {product.brand && (
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                    {product.brand}
                  </span>
                )}
                <h3 className="t-headline-md uppercase text-primary">{product.product_name}</h3>
                <Link
                  href={`/product/${product.slug}`}
                  className="mt-2 inline-flex items-center gap-2 border-b border-primary font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:text-accent hover:border-accent"
                >
                  View Details
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
