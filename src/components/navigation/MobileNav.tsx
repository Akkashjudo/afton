"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import type { BrandSummary, CategorySummary } from "@/types/product";
import { EASE } from "@/components/motion/variants";
import { Portal } from "@/components/ui/Portal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

const SIMPLE_LINKS = [
  { label: "Commercial Solutions", href: "/commercial-solutions" },
  { label: "Home Fitness", href: "/category/home-fitness" },
  { label: "Store Locator", href: "/store-locator" },
  { label: "Download Catalogue", href: "/#catalogue" },
  { label: "Support", href: "/support" },
  { label: "About Afton", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav({
  categories,
  brands,
}: {
  categories: CategorySummary[];
  brands: BrandSummary[];
}) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<"categories" | "brands" | null>(null);
  const reduceMotion = useReducedMotion();

  /**
   * Reduced-motion users must never get a transform-based slide: Framer
   * disables transform animations for them, which would leave the panel stuck
   * at its off-screen `x: "100%"` initial and make the menu button appear
   * dead. Fade it in place instead — no transform involved.
   */
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center text-primary lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" aria-hidden />
      </button>

      <Portal>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed inset-y-0 right-0 z-[60] flex w-[86vw] max-w-sm flex-col border-l border-outline-variant bg-surface lg:hidden"
              {...panelMotion}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                  Menu
                </span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center hover:bg-surface-container"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                <Accordion
                  label="Categories"
                  isOpen={section === "categories"}
                  onToggle={() => setSection((s) => (s === "categories" ? null : "categories"))}
                >
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={close}
                      className="flex min-h-[44px] items-center justify-between px-5 py-3 text-sm text-on-surface-variant active:bg-surface-high"
                    >
                      {c.name}
                      <span className="font-mono text-[10px]">{c.count}</span>
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    onClick={close}
                    className="flex min-h-[44px] items-center px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-accent"
                  >
                    All Products →
                  </Link>
                </Accordion>

                <Accordion
                  label="Brands"
                  isOpen={section === "brands"}
                  onToggle={() => setSection((s) => (s === "brands" ? null : "brands"))}
                >
                  {brands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brand/${b.slug}`}
                      onClick={close}
                      className="flex min-h-[44px] items-center justify-between px-5 py-3 text-sm text-on-surface-variant active:bg-surface-high"
                    >
                      {b.name}
                      <span className="font-mono text-[10px]">{b.count}</span>
                    </Link>
                  ))}
                </Accordion>

                {SIMPLE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="flex min-h-[52px] items-center border-b border-outline-variant px-5 py-4 font-display text-base font-bold uppercase tracking-tight text-primary active:bg-surface-high"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-outline-variant bg-surface-low p-5">
                <Link
                  href="/enquiry"
                  onClick={close}
                  className="mb-3 flex min-h-[48px] w-full items-center justify-center bg-primary font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary"
                >
                  Request Quote
                </Link>
                <div className="flex gap-3">
                  <a
                    href={buildWhatsAppLink("Hello Afton Fitness, I'd like some help choosing equipment.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-whatsapp font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href={`tel:${siteConfig.contact.salesPhoneHref}`}
                    className="flex min-h-[48px] flex-1 items-center justify-center gap-2 border border-outline-variant font-mono text-[11px] font-semibold uppercase tracking-[0.1em]"
                  >
                    <Phone className="h-4 w-4" aria-hidden /> Call
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </Portal>
    </>
  );
}

function Accordion({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-outline-variant">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-h-[52px] w-full items-center justify-between px-5 py-4 font-display text-base font-bold uppercase tracking-tight text-primary"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden bg-surface-low"
          >
            <div className="py-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
