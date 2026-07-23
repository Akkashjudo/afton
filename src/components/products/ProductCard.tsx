import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/types/product";
import { buildAltText } from "@/lib/images";
import { AddToEnquiryButton } from "@/components/enquiry/AddToEnquiryButton";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductSummary;
  priority?: boolean;
}) {
  const image = product.primaryImage;
  const isCommercial = product.categorySlug === "commercial-gym-equipment";

  return (
    <div className="group flex flex-col border border-transparent bg-surface transition-all duration-300 hover:border-outline-variant">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-technical p-8">
        <Link href={`/product/${product.slug}`} className="flex h-full w-full items-center justify-center">
          {image ? (
            <Image
              src={image.localPath}
              alt={buildAltText(product.product_name, 0)}
              width={image.width}
              height={image.height}
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="px-4 text-center font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
              Product imagery being updated
            </span>
          )}
        </Link>
        {isCommercial && (
          <div className="absolute left-4 top-4 bg-primary px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-tight text-white">
            Commercial
          </div>
        )}
        <AddToEnquiryButton product={product} variant="circle" />
      </div>

      <div className="flex flex-grow flex-col p-5">
        {product.brand && (
          <span className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            {product.brand}
          </span>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="t-headline-md mb-4 leading-tight text-primary transition-colors group-hover:text-accent">
            {product.product_name}
          </h3>
        </Link>
        <div className="mt-auto space-y-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
            Contact for Pricing
          </p>
          <AddToEnquiryButton product={product} variant="quote" />
        </div>
      </div>
    </div>
  );
}
