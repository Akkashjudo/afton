"use client";

import type { ProductSummary } from "@/types/product";
import { useEnquiry } from "@/lib/enquiry/context";
import { buildWhatsAppLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Sticky bottom action bar on mobile product pages. */
export function StickyEnquiryBar({ product }: { product: ProductSummary }) {
  const { addItem, openDrawer } = useEnquiry();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-px border-t border-outline-variant bg-surface lg:hidden">
      <button
        type="button"
        onClick={() => {
          addItem({
            slug: product.slug,
            product_name: product.product_name,
            brand: product.brand,
            category: product.category,
            product_url: product.product_url,
            image: product.primaryImage?.localPath,
      sku: product.sku,
            quantity: 1,
          });
          openDrawer();
        }}
        className="flex-1 bg-primary py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary"
      >
        Request Quote
      </button>
      <a
        href={buildWhatsAppLink(`Hello Afton Fitness, I'm interested in the ${product.product_name}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-whatsapp px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
