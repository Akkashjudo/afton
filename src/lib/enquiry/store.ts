import type { EnquiryItem } from "./types";

const STORAGE_KEY = "afton-enquiry-list";

type Listener = () => void;

const EMPTY_ITEMS: EnquiryItem[] = [];

let items: EnquiryItem[] = EMPTY_ITEMS;
let loaded = false;
const listeners = new Set<Listener>();

function load(): EnquiryItem[] {
  if (loaded || typeof window === "undefined") return items;
  loaded = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) items = JSON.parse(stored);
  } catch {
    // Corrupt/blocked storage — start from an empty list rather than crash.
  }
  return items;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private browsing, quota) — in-memory state still works.
  }
}

function emit() {
  persist();
  for (const listener of listeners) listener();
}

/**
 * Minimal external store for the enquiry list, consumed via
 * useSyncExternalStore. This avoids the SSR/client hydration mismatch that a
 * naive `useEffect(() => setState(localStorage...))` pattern would cause —
 * the server snapshot is always an empty list, and React reconciles the real
 * snapshot itself once mounted.
 */
export const enquiryStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): EnquiryItem[] {
    return load();
  },
  getServerSnapshot(): EnquiryItem[] {
    return EMPTY_ITEMS;
  },
  addItem(item: EnquiryItem) {
    const existing = items.find((i) => i.slug === item.slug);
    items = existing
      ? items.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      : [...items, item];
    emit();
  },
  removeItem(slug: string) {
    items = items.filter((i) => i.slug !== slug);
    emit();
  },
  updateQuantity(slug: string, quantity: number) {
    items = items.map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i));
    emit();
  },
  clear() {
    items = [];
    emit();
  },
};
