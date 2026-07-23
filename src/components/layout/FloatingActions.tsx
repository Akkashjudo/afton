"use client";

import { ClipboardList } from "lucide-react";
import { useEnquiry } from "@/lib/enquiry/context";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/site-config";

/** Fixed WhatsApp + enquiry-list FABs (bottom-right), per the Stitch home design. */
export function FloatingActions() {
  const { count, openDrawer } = useEnquiry();

  return (
    // Desktop only — on mobile these actions live in the sticky MobileActionBar.
    <div className="fixed bottom-10 right-8 z-40 hidden flex-col gap-4 lg:flex">
      <a
        href={buildWhatsAppLink("Hello Afton Fitness, I'd like to enquire about equipment.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Afton on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl transition-transform hover:scale-110"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <button
        type="button"
        onClick={openDrawer}
        aria-label={`Open enquiry list${count > 0 ? ` (${count} items)` : ""}`}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl transition-transform hover:scale-110"
      >
        <ClipboardList className="h-6 w-6" aria-hidden />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
