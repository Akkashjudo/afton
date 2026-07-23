"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { enquiryStore } from "./store";
import type { EnquiryItem } from "./types";

type EnquiryContextValue = {
  items: EnquiryItem[];
  count: number;
  addItem: (item: EnquiryItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    enquiryStore.subscribe,
    enquiryStore.getSnapshot,
    enquiryStore.getServerSnapshot,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addItem = useCallback((item: EnquiryItem) => enquiryStore.addItem(item), []);
  const removeItem = useCallback((slug: string) => enquiryStore.removeItem(slug), []);
  const updateQuantity = useCallback(
    (slug: string, quantity: number) => enquiryStore.updateQuantity(slug, quantity),
    [],
  );
  const clear = useCallback(() => enquiryStore.clear(), []);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clear,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, addItem, removeItem, updateQuantity, clear, isDrawerOpen, openDrawer, closeDrawer],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used within an EnquiryProvider");
  return ctx;
}
