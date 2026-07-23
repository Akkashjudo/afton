import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Product enquiries, service requests, AMC, spare parts, warranty assistance, and FAQs from Afton Fitness.",
};

const FAQS = [
  {
    q: "How do I ask about a specific product?",
    a: "Open the product page and use \"Add to Enquiry List\" or \"WhatsApp Enquiry\" — our team will follow up with availability, pricing, and delivery details for your location.",
  },
  {
    q: "Can I request equipment for a full commercial gym?",
    a: "Yes — use the Commercial Solutions page or the enquiry form to describe your facility, and we'll help put together an equipment plan and quotation.",
  },
  {
    q: "Do you offer installation, AMC, and service support?",
    a: "We provide installation, Annual Maintenance Contracts (AMC), spare parts, and equipment servicing. Reach out via the contact page with your product and location.",
  },
  {
    q: "Where can I find product specifications?",
    a: "Full specifications are listed on each product page where available. If a product's specifications aren't listed yet, contact us and we'll get you the details directly.",
  },
];

export default function SupportPage() {
  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Support" }]} />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">Support</h1>
      <p className="mt-3 max-w-2xl t-body-lg text-on-surface-variant">
        Questions about a product, an order, service, or a commercial project — start here.
      </p>

      <div className="mt-12 divide-y divide-outline-variant border-y border-outline-variant">
        {FAQS.map((faq) => (
          <div key={faq.q} className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12">
            <h2 className="t-headline-md uppercase text-primary md:col-span-5">{faq.q}</h2>
            <p className="text-on-surface-variant md:col-span-7">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/contact" className="bg-primary px-10 py-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent">
          Contact Support
        </Link>
        <a
          href={buildWhatsAppLink("Hello Afton Fitness, I need support with a product.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-whatsapp px-10 py-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp Us
        </a>
      </div>
    </div>
  );
}
