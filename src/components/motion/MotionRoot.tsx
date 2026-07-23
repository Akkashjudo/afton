"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion's own SSR-safe reduced-motion handling — "user" defers to the
 * OS-level `prefers-reduced-motion` setting and neutralizes transform-based
 * animation for those users. Deliberately not reimplemented with a manual
 * `useReducedMotion()` branch in each component: that pattern renders a
 * different element tree on the server vs. the client's first paint and
 * breaks hydration.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
