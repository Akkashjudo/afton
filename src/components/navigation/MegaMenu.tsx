"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { BrandSummary, CategorySummary } from "@/types/product";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils/cn";

type MenuKey = "products" | "brands" | "more";

/**
 * Desktop navigation with mega-menu panels.
 *
 * Layout rules that matter (these were the source of the earlier breakage):
 * - every trigger is `whitespace-nowrap shrink-0`, so labels can never wrap to
 *   a second line and blow out the 80px header;
 * - the widest secondary links (Home Fitness / Store Locator) only join the
 *   main row at `xl`; below that they stay reachable inside the "More" panel
 *   rather than being dropped;
 * - panels are positioned against the fixed <header>, so they can't be clipped
 *   by the flex row or open off-screen.
 */
export function MegaMenu({
  categories,
  brands,
}: {
  categories: CategorySummary[];
  brands: BrandSummary[];
}) {
  const [open, setOpen] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  function openNow(key: MenuKey) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  }
  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }
  const closeNow = () => setOpen(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hidden items-center gap-5 lg:flex xl:gap-6">
      <Trigger label="Products" isOpen={open === "products"} onOpen={() => openNow("products")} onCloseSoon={closeSoon} />
      <Trigger label="Brands" isOpen={open === "brands"} onOpen={() => openNow("brands")} onCloseSoon={closeSoon} />
      <NavLink href="/commercial-solutions">Commercial</NavLink>
      {/* Promoted into the main row only when there's room. */}
      <NavLink href="/category/home-fitness" className="hidden xl:inline-flex">
        Home Fitness
      </NavLink>
      <NavLink href="/store-locator" className="hidden xl:inline-flex">
        Store Locator
      </NavLink>
      <Trigger label="More" isOpen={open === "more"} onOpen={() => openNow("more")} onCloseSoon={closeSoon} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            onMouseEnter={() => openNow(open)}
            onMouseLeave={closeSoon}
            className="absolute inset-x-0 top-20 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-outline-variant bg-surface shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]"
          >
            <div className="container-afton py-10">
              {open === "products" && (
                <div className="grid grid-cols-3 gap-x-8 gap-y-9 xl:grid-cols-4">
                  {categories.map((category) => (
                    <div key={category.slug}>
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={closeNow}
                        className="font-display text-base font-bold uppercase tracking-tight text-primary hover:text-accent"
                      >
                        {category.name}
                        <span className="ml-2 font-mono text-[10px] font-normal text-on-surface-variant">
                          {category.count}
                        </span>
                      </Link>
                      {category.subcategories.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {category.subcategories.slice(0, 5).map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={`/category/${category.slug}/${sub.slug}`}
                                onClick={closeNow}
                                className="text-sm text-on-surface-variant hover:text-primary"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {open === "brands" && (
                <div className="grid grid-cols-3 gap-x-8 gap-y-3 xl:grid-cols-5">
                  {brands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/brand/${brand.slug}`}
                      onClick={closeNow}
                      className="flex items-baseline gap-2 py-1.5 text-sm text-on-surface-variant hover:text-primary"
                    >
                      <span className="font-display font-bold uppercase tracking-tight text-primary">
                        {brand.name}
                      </span>
                      <span className="font-mono text-[10px]">{brand.count}</span>
                    </Link>
                  ))}
                </div>
              )}

              {open === "more" && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3">
                  {/* Shown here only while they're not in the main row. */}
                  <MoreLink href="/category/home-fitness" onClick={closeNow} className="xl:hidden">
                    Home Fitness
                  </MoreLink>
                  <MoreLink href="/store-locator" onClick={closeNow} className="xl:hidden">
                    Store Locator
                  </MoreLink>
                  <MoreLink href="/#catalogue" onClick={closeNow}>Download Catalogue</MoreLink>
                  <MoreLink href="/contact" onClick={closeNow}>Contact</MoreLink>
                  <MoreLink href="/about" onClick={closeNow}>About Afton</MoreLink>
                  <MoreLink href="/support" onClick={closeNow}>Support &amp; Service</MoreLink>
                  <MoreLink href="/products" onClick={closeNow}>All Products</MoreLink>
                  <MoreLink href="/brands" onClick={closeNow}>All Brands</MoreLink>
                </div>
              )}

              {(open === "products" || open === "brands") && (
                <div className="mt-10 flex items-center justify-between border-t border-outline-variant pt-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-surface-variant">
                    {categories.reduce((n, c) => n + c.count, 0)} products · {categories.length}{" "}
                    categories · {brands.length} brands
                  </p>
                  <Link
                    href={open === "brands" ? "/brands" : "/products"}
                    onClick={closeNow}
                    className="group flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-primary hover:text-accent"
                  >
                    {open === "brands" ? "All Brands" : "All Products"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Trigger({
  label,
  isOpen,
  onOpen,
  onCloseSoon,
}: {
  label: string;
  isOpen: boolean;
  onOpen: () => void;
  onCloseSoon: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="true"
      onMouseEnter={onOpen}
      onMouseLeave={onCloseSoon}
      onFocus={onOpen}
      onClick={() => (isOpen ? onCloseSoon() : onOpen())}
      className={cn(
        "flex shrink-0 items-center gap-1 whitespace-nowrap py-2 font-body text-[15px] transition-colors",
        isOpen ? "text-primary" : "text-on-surface-variant hover:text-primary",
      )}
    >
      {label}
      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} aria-hidden />
    </button>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 whitespace-nowrap py-2 font-body text-[15px] text-on-surface-variant transition-colors hover:text-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}

function MoreLink({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex min-h-[44px] items-center font-display text-base font-bold uppercase tracking-tight text-primary hover:text-accent",
        className,
      )}
    >
      {children}
    </Link>
  );
}
