"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { ProductSummary } from "@/types/product";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils/cn";

/**
 * Command-style search overlay. It receives a lightweight index (name/brand/
 * category/slug/thumb only) rather than the full catalogue, so the client
 * bundle stays small.
 *
 * The panel is mounted only while open, so it starts from clean state every
 * time — no reset-on-open effect (which would cause a cascading re-render).
 */
export function SearchOverlay({
  open,
  onClose,
  index,
}: {
  open: boolean;
  onClose: () => void;
  index: ProductSummary[];
}) {
  return (
    <AnimatePresence>
      {open && <SearchPanel key="search-panel" onClose={onClose} index={index} />}
    </AnimatePresence>
  );
}

function SearchPanel({
  onClose,
  index,
}: {
  onClose: () => void;
  index: ProductSummary[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // Transform animations are disabled for reduced-motion users, so a `y`
  // offset would leave the panel parked under the header. Fade only.
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return index
      .map((p) => {
        const haystack = `${p.product_name} ${p.brand ?? ""} ${p.category ?? ""}`.toLowerCase();
        if (!terms.every((t) => haystack.includes(t))) return null;
        const score = p.product_name.toLowerCase().startsWith(terms[0]) ? 0 : 1;
        return { product: p, score };
      })
      .filter((x): x is { product: ProductSummary; score: number } => x !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((x) => x.product);
  }, [query, index]);

  // Lock scroll and focus the field on mount.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter") {
        const target = results[active];
        if (target) {
          onClose();
          router.push(`/product/${target.slug}`);
        } else if (query.trim()) {
          onClose();
          router.push(`/products?q=${encodeURIComponent(query.trim())}`);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, active, query, onClose, router]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[70] bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="fixed inset-x-0 top-0 z-[70] border-b border-outline-variant bg-surface"
        {...panelMotion}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="container-afton py-5">
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 shrink-0 text-on-surface-variant" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="Search treadmills, racks, brands…"
              aria-label="Search products"
              className="min-h-[44px] w-full bg-transparent font-display text-xl font-bold tracking-tight outline-none placeholder:font-body placeholder:text-base placeholder:font-normal placeholder:text-on-surface-variant"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-11 w-11 shrink-0 items-center justify-center hover:bg-surface-container"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {query.trim() && (
            <div className="mt-5 border-t border-outline-variant pt-5">
              {results.length === 0 ? (
                <p className="py-6 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                  No products match “{query}”. Try a brand or equipment type.
                </p>
              ) : (
                <ul className="max-h-[55vh] overflow-y-auto">
                  {results.map((p, i) => (
                    <li key={p.slug}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          "flex min-h-[44px] items-center gap-4 px-2 py-3 transition-colors",
                          i === active ? "bg-surface-high" : "hover:bg-surface-low",
                        )}
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-technical">
                          {p.primaryImage && (
                            <Image
                              src={p.primaryImage.localPath}
                              alt=""
                              width={48}
                              height={48}
                              className="h-full w-full object-contain p-1"
                            />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-body text-sm text-primary">
                            <Highlight text={p.product_name} query={query} />
                          </span>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">
                            {[p.brand, p.category].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/products?q=${encodeURIComponent(query.trim())}`}
                onClick={onClose}
                className="mt-3 inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-primary underline-offset-4 hover:text-accent hover:underline"
              >
                View all results for “{query.trim()}”
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1 || !q) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-accent">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}
