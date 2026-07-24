import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBrands, getProductsByBrand } from "@/lib/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Afton Fitness brings together the world's leading fitness equipment brands — Spirit, Sole, Impulse, REP Fitness, Eleiko, Body-Solid and more.",
};

export default function BrandsPage() {
  const brands = getBrands();

  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">Our Brands</h1>
      <p className="mt-2 max-w-2xl font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        {brands.length} Authorised Fitness Equipment Brands
      </p>

      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => {
          const image = getProductsByBrand(brand.slug).find((p) => p.image_count > 0)?.local_images[0];
          return (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="group flex flex-col border border-outline-variant transition-[transform,border-color] duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:border-primary motion-reduce:transform-none"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-technical p-8">
                {image && (
                  <Image
                    src={image.localPath}
                    alt=""
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h2 className="font-display text-lg font-bold uppercase tracking-tight text-primary">
                    {brand.name}
                  </h2>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant">
                    {brand.count} products
                  </p>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 text-on-surface-variant transition-all group-hover:text-accent"
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
