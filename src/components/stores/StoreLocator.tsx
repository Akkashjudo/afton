"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Navigation, Phone, Search, X } from "lucide-react";
import {
  STORES,
  STATES,
  STORE_TYPES,
  FLAGSHIP_STORE_ID,
  telHref,
  storeMapsUrl,
} from "@/data/stores";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, buildWhatsAppLink, fullAddress } from "@/lib/site-config";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils/cn";

export function StoreLocator() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>(FLAGSHIP_STORE_ID);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STORES.filter((s) => {
      if (state && s.state !== state) return false;
      if (type && s.type !== type) return false;
      if (q && !`${s.name} ${s.city} ${s.state}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, state, type]);

  const selected = STORES.find((s) => s.id === selectedId) ?? filtered[0] ?? STORES[0];

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 border-b border-outline-variant pb-6 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city or store name…"
            aria-label="Search stores by city or name"
            className="w-full border border-outline-variant bg-white py-3 pl-11 pr-4 font-body text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={state ?? ""}
            onChange={(e) => setState(e.target.value || null)}
            aria-label="Filter by state"
            className="min-h-[44px] flex-1 border border-outline-variant bg-white px-3 font-mono text-xs uppercase tracking-[0.1em] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary lg:flex-none"
          >
            <option value="">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={type ?? ""}
            onChange={(e) => setType(e.target.value || null)}
            aria-label="Filter by store type"
            className="min-h-[44px] flex-1 border border-outline-variant bg-white px-3 font-mono text-xs uppercase tracking-[0.1em] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary lg:flex-none"
          >
            <option value="">All Types</option>
            {STORE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {(state || type || query) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
            {filtered.length} {filtered.length === 1 ? "location" : "locations"}
          </span>
          {state && <Chip label={state} onClear={() => setState(null)} />}
          {type && <Chip label={type} onClear={() => setType(null)} />}
          {query && <Chip label={`"${query}"`} onClear={() => setQuery("")} />}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* List */}
        <div className="lg:col-span-5">
          <div className="hide-scrollbar max-h-none divide-y divide-outline-variant border-y border-outline-variant lg:max-h-[640px] lg:overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-16 text-center font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                No locations match your search.
              </p>
            ) : (
              filtered.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setSelectedId(store.id)}
                  aria-pressed={store.id === selected?.id}
                  className={cn(
                    "flex w-full min-h-[44px] items-start justify-between gap-4 px-4 py-5 text-left transition-colors",
                    store.id === selected?.id ? "bg-primary text-on-primary" : "hover:bg-surface-high",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-display text-base font-bold uppercase tracking-tight">
                      {store.name}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block font-mono text-[11px] uppercase tracking-[0.1em]",
                        store.id === selected?.id ? "text-on-dark-muted" : "text-on-surface-variant",
                      )}
                    >
                      {store.state} · {store.type}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[11px]",
                      store.id === selected?.id ? "text-on-primary" : "text-on-surface-variant",
                    )}
                  >
                    {store.phones[0]}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail + map */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="border border-outline-variant bg-white"
              >
                <div className="aspect-[16/10] w-full bg-surface-low">
                  <iframe
                    key={selected.id}
                    title={`Map of Afton Fitness ${selected.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      selected.id === FLAGSHIP_STORE_ID
                        ? fullAddress()
                        : `Afton Fitness ${selected.name} ${selected.city} ${selected.state}`,
                    )}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <span className="t-label text-accent">{selected.type}</span>
                  <h2 className="t-headline-md mt-2 uppercase text-primary">{selected.name}</h2>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                    {selected.city}, {selected.state}
                  </p>

                  {selected.id === FLAGSHIP_STORE_ID && (
                    <div className="mt-5 flex gap-3 border-t border-outline-variant pt-5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      <address className="not-italic text-on-surface-variant">
                        {siteConfig.contact.address.line1},<br />
                        {siteConfig.contact.address.line2},<br />
                        {siteConfig.contact.address.city}, {siteConfig.contact.address.state} –{" "}
                        {siteConfig.contact.address.pincode}
                      </address>
                    </div>
                  )}

                  <div className="mt-5 border-t border-outline-variant pt-5">
                    <span className="t-label text-on-surface-variant">Phone</span>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                      {selected.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${telHref(phone)}`}
                          className="font-body text-base text-primary underline-offset-4 hover:text-accent hover:underline"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <a
                      href={`tel:${telHref(selected.phones[0])}`}
                      className="flex min-h-[44px] items-center justify-center gap-2 bg-primary px-3 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent"
                    >
                      <Phone className="h-4 w-4" aria-hidden /> Call
                    </a>
                    <a
                      href={buildWhatsAppLink(
                        `Hello Afton Fitness, I'd like to enquire about the ${selected.name} location.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center justify-center gap-2 bg-whatsapp px-3 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                    </a>
                    <a
                      href={
                        selected.id === FLAGSHIP_STORE_ID
                          ? siteConfig.contact.mapsUrl
                          : storeMapsUrl(selected)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center justify-center gap-2 border border-outline-variant px-3 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:border-primary"
                    >
                      <Navigation className="h-4 w-4" aria-hidden /> Directions
                    </a>
                    <a
                      href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                        `Enquiry — ${selected.name}`,
                      )}`}
                      className="flex min-h-[44px] items-center justify-center gap-2 border border-outline-variant px-3 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:border-primary"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="flex items-center gap-1.5 border border-outline-variant bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] hover:border-primary"
    >
      {label}
      <X className="h-3 w-3" aria-hidden />
    </button>
  );
}
