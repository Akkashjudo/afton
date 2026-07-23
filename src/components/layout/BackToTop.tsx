"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex min-h-[44px] items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted transition-colors hover:text-white"
    >
      Back to Top
      <ArrowUp className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
