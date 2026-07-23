"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Renders children into <body>.
 *
 * Required for any `fixed` overlay that lives inside the site header: the
 * header uses `backdrop-blur`, and `backdrop-filter` makes an element the
 * containing block for fixed-position descendants. Without this, a drawer
 * using `inset-y-0` resolves against the 80px header instead of the viewport
 * and collapses to header height.
 *
 * The mount check uses useSyncExternalStore (rather than setState in an
 * effect) so `document` is only touched on the client, without triggering a
 * cascading re-render.
 */
export function Portal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
