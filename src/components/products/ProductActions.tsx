"use client";

import { useState } from "react";
import { Check, Link2, ListPlus, Send, Share2 } from "lucide-react";
import type { ProductSummary } from "@/types/product";
import { useEnquiry } from "@/lib/enquiry/context";
import { buildProductEnquiryMessage, productUrl } from "@/lib/enquiry/whatsapp";
import { buildWhatsAppLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function ProductActions({ product }: { product: ProductSummary }) {
  const { addItem, openDrawer } = useEnquiry();
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  function add(open: boolean) {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    if (open) openDrawer();
  }

  const enquiryMessage = buildProductEnquiryMessage({
    product_name: product.product_name,
    slug: product.slug,
    brand: product.brand,
    sku: product.sku,
  });

  async function share() {
    const url = productUrl(product.slug);
    const data = { title: product.product_name, text: product.product_name, url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // User dismissed the share sheet — fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — nothing further we can do silently.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => add(true)}
        className="flex min-h-[56px] w-full items-center justify-center gap-3 bg-primary font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-all hover:bg-accent active:scale-[0.98]"
      >
        Request a Quote
        <Send className="h-5 w-5" aria-hidden />
      </button>

      <button
        type="button"
        onClick={() => add(false)}
        className="flex min-h-[56px] w-full items-center justify-center gap-3 border border-outline font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-all hover:bg-surface-high active:scale-[0.98]"
      >
        {added ? (
          <>
            Added to List <Check className="h-5 w-5" aria-hidden />
          </>
        ) : (
          <>
            Add to Enquiry List <ListPlus className="h-5 w-5" aria-hidden />
          </>
        )}
      </button>

      <a
        href={buildWhatsAppLink(enquiryMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[56px] w-full items-center justify-center gap-3 bg-whatsapp font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all hover:opacity-90 active:scale-[0.98]"
      >
        Enquire on WhatsApp
        <WhatsAppIcon className="h-5 w-5" />
      </a>

      <button
        type="button"
        onClick={share}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:text-primary"
      >
        {copied ? (
          <>
            <Link2 className="h-4 w-4" aria-hidden /> Link Copied
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" aria-hidden /> Share Product
          </>
        )}
      </button>
    </div>
  );
}
