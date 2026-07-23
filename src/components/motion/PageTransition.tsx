"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "./variants";

/**
 * Subtle route entrance transition. Keyed on pathname so it re-runs on
 * navigation. Fast and non-blocking — reduced-motion is neutralised globally
 * by <MotionConfig reducedMotion="user"> in MotionRoot.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
