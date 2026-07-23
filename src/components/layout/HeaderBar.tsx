"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import type { BrandSummary, CategorySummary, ProductSummary } from "@/types/product";
import { Logo } from "./Logo";
import { MegaMenu } from "@/components/navigation/MegaMenu";
import { MobileNav } from "@/components/navigation/MobileNav";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useEnquiry } from "@/lib/enquiry/context";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

export function HeaderBar({
  categories,
  brands,
  searchIndex,
}: {
  categories: CategorySummary[];
  brands: BrandSummary[];
  searchIndex: ProductSummary[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openDrawer } = useEnquiry();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl-K opens search, like a native product catalogue.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full border-b border-outline-variant bg-surface/95 backdrop-blur transition-shadow duration-300",
          scrolled && "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]",
        )}
      >
        <div className="container-afton flex h-20 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6 xl:gap-9">
            <Logo priority />
            <MegaMenu categories={categories} brands={brands} />
          </div>

          <div className="flex shrink-0 items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-11 w-11 items-center justify-center text-primary transition-colors hover:text-accent"
            >
              <Search className="h-5 w-5" aria-hidden />
            </button>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open enquiry list${count > 0 ? ` (${count} items)` : ""}`}
              className="relative flex h-11 w-11 items-center justify-center text-primary transition-colors hover:text-accent"
            >
              <ClipboardList className="h-5 w-5" aria-hidden />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            {/* WhatsApp CTA — icon-only on desktop to keep the row compact. */}
            <a
              href={buildWhatsAppLink(
                "Hello Afton Fitness, I'd like to enquire about equipment.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enquire on WhatsApp"
              title="Enquire on WhatsApp"
              className="hidden h-11 w-11 items-center justify-center text-whatsapp transition-opacity hover:opacity-80 lg:flex"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>

            <Link
              href="/enquiry"
              className="hidden min-h-[44px] shrink-0 items-center whitespace-nowrap bg-primary px-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent md:inline-flex"
            >
              Request Quote
            </Link>

            <MobileNav categories={categories} brands={brands} />
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} index={searchIndex} />
    </>
  );
}
