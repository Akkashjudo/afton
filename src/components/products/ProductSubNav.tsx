"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type SubNavSection = { id: string; label: string };

export function ProductSubNav({ sections }: { sections: SubNavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    function onScroll() {
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 160) current = s.id;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  function go(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div className="sticky top-20 z-30 mt-24 border-b border-outline-variant bg-surface/95 backdrop-blur-md">
      <div className="hide-scrollbar flex gap-8 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            className={cn(
              "whitespace-nowrap border-b-2 py-6 font-mono text-xs font-semibold uppercase tracking-[0.1em] transition-colors",
              active === s.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
