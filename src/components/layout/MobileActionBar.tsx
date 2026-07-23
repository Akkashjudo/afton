"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileText, Phone } from "lucide-react";
import { useEnquiry } from "@/lib/enquiry/context";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";

/**
 * Sticky mobile action bar: Call · WhatsApp · Enquire · Catalogue.
 *
 * Hidden on product pages, which have their own product-specific sticky bar,
 * so the two never stack. Body padding (`.has-mobile-bar`) reserves the bar's
 * height so it never covers page content or the footer.
 */
export function MobileActionBar() {
  const { count, openDrawer } = useEnquiry();
  const pathname = usePathname();

  if (pathname.startsWith("/product/")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-outline-variant bg-surface/98 backdrop-blur lg:hidden">
      <a
        href={`tel:${siteConfig.contact.salesPhoneHref}`}
        className="flex min-h-[56px] flex-col items-center justify-center gap-1 border-r border-outline-variant text-primary active:bg-surface-high"
      >
        <Phone className="h-5 w-5" aria-hidden />
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em]">Call</span>
      </a>
      <a
        href={buildWhatsAppLink("Hello Afton Fitness, I'd like to enquire about equipment.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[56px] flex-col items-center justify-center gap-1 border-r border-outline-variant text-whatsapp active:bg-surface-high"
      >
        <WhatsAppIcon className="h-5 w-5" />
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-primary">
          WhatsApp
        </span>
      </a>
      <button
        type="button"
        onClick={openDrawer}
        className="relative flex min-h-[56px] flex-col items-center justify-center gap-1 border-r border-outline-variant text-primary active:bg-surface-high"
      >
        <ClipboardList className="h-5 w-5" aria-hidden />
        {count > 0 && (
          <span className="absolute right-1/4 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
            {count}
          </span>
        )}
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em]">Enquire</span>
      </button>
      <Link
        href="/#catalogue"
        className="flex min-h-[56px] flex-col items-center justify-center gap-1 text-primary active:bg-surface-high"
      >
        <FileText className="h-5 w-5" aria-hidden />
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em]">Catalogue</span>
      </Link>
    </div>
  );
}
