"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useEnquiry } from "@/lib/enquiry/context";
import { buildWhatsAppMessage } from "@/lib/enquiry/whatsapp";
import { buildWhatsAppLink } from "@/lib/site-config";
import { EASE } from "@/components/motion/variants";

export function EnquiryDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity } = useEnquiry();
  const reduceMotion = useReducedMotion();

  // See MobileNav: a transform-based slide would leave this panel off-screen
  // for reduced-motion users, since Framer disables transform animations.
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  useEffect(() => {
    if (!isDrawerOpen) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry list"
            className="fixed inset-y-0 right-0 z-[60] flex w-[90vw] max-w-md flex-col border-l border-outline-variant bg-surface"
            {...panelMotion}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-5">
              <span className="t-label text-on-surface-variant">
                Enquiry List ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center hover:bg-surface-container"
                aria-label="Close enquiry list"
                onClick={closeDrawer}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <p className="py-10 text-center text-sm text-on-surface-variant">
                  No products added yet. Browse the catalogue and add equipment
                  you&apos;d like a quotation for.
                </p>
              ) : (
                <ul className="divide-y divide-outline-variant">
                  {items.map((item) => (
                    <li key={item.slug} className="flex items-start justify-between gap-3 py-5">
                      <div className="min-w-0">
                        <p className="font-display text-base font-bold leading-tight">
                          {item.product_name}
                        </p>
                        {item.brand && (
                          <p className="t-label mt-1 text-on-surface-variant">{item.brand}</p>
                        )}
                        <div className="mt-3 inline-flex items-center border border-outline-variant">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center hover:text-accent"
                            aria-label={`Decrease quantity for ${item.product_name}`}
                            onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden />
                          </button>
                          <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center hover:text-accent"
                            aria-label={`Increase quantity for ${item.product_name}`}
                            onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="t-label text-on-surface-variant transition-colors hover:text-error"
                        onClick={() => removeItem(item.slug)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-outline-variant px-6 py-5">
                <Link
                  href="/enquiry"
                  onClick={closeDrawer}
                  className="flex w-full items-center justify-center border border-primary py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  Review &amp; Submit Enquiry
                </Link>
                <a
                  href={buildWhatsAppLink(buildWhatsAppMessage(items))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center bg-whatsapp py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
                >
                  Send via WhatsApp
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
