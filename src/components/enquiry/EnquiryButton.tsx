"use client";

import { useEnquiry } from "@/lib/enquiry/context";

/** Header "Enquiry List (n)" trigger — opens the drawer. */
export function EnquiryButton() {
  const { count, openDrawer } = useEnquiry();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="hidden md:inline-flex items-center border border-outline px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-on-primary"
    >
      Enquiry List ({count})
    </button>
  );
}
