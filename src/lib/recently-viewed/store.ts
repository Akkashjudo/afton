import type { ProductSummary } from "@/types/product";

const STORAGE_KEY = "afton-recently-viewed";
const MAX_ITEMS = 8;

type Listener = () => void;

const EMPTY: ProductSummary[] = [];

let items: ProductSummary[] = EMPTY;
let loaded = false;
const listeners = new Set<Listener>();

function load(): ProductSummary[] {
  if (loaded || typeof window === "undefined") return items;
  loaded = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) items = JSON.parse(stored);
  } catch {
    // Corrupt/blocked storage — start empty rather than crash.
  }
  return items;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable — in-memory state still works for this tab.
  }
}

export const recentlyViewedStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): ProductSummary[] {
    return load();
  },
  getServerSnapshot(): ProductSummary[] {
    return EMPTY;
  },
  track(product: ProductSummary) {
    load();
    items = [product, ...items.filter((p) => p.slug !== product.slug)].slice(0, MAX_ITEMS);
    persist();
    for (const listener of listeners) listener();
  },
};
