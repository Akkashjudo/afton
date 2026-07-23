"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useEnquiry } from "@/lib/enquiry/context";
import type { ProductSummary } from "@/types/product";
import { cn } from "@/lib/utils/cn";

type Variant = "circle" | "quote";

export function AddToEnquiryButton({
  product,
  variant = "circle",
  openOnAdd = false,
}: {
  product: ProductSummary;
  variant?: Variant;
  openOnAdd?: boolean;
}) {
  const { addItem, openDrawer } = useEnquiry();
  const [added, setAdded] = useState(false);

  function handleAdd() {
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
    setTimeout(() => setAdded(false), 1400);
    if (openOnAdd) openDrawer();
  }

  if (variant === "circle") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.product_name} to enquiry list`}
        className={cn(
          "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-white transition-colors",
          added ? "bg-primary text-white" : "hover:bg-primary hover:text-white",
        )}
      >
        {added ? <Check className="h-5 w-5" aria-hidden /> : <Plus className="h-5 w-5" aria-hidden />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="flex w-full items-center justify-center gap-2 bg-primary py-3 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent"
    >
      {added ? (
        <>
          Added <Check className="h-4 w-4" aria-hidden />
        </>
      ) : (
        <>
          Add to Enquiry <Plus className="h-4 w-4" aria-hidden />
        </>
      )}
    </button>
  );
}
