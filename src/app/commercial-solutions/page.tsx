import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  Ruler,
  Truck,
  Wrench,
  RefreshCw,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Commercial Gym Solutions",
  description:
    "Facility planning, equipment selection, installation, and AMC for gyms, hotels, apartments, corporates, and institutions across India.",
};

const SERVICES = [
  { icon: ClipboardCheck, title: "Facility Planning", body: "Talk through your space, member profile, and goals before choosing equipment." },
  { icon: Building2, title: "Equipment Selection", body: "A curated equipment list across our brand portfolio, matched to your budget." },
  { icon: Ruler, title: "Space Planning", body: "Layout guidance so the floor plan works for members and staff alike." },
  { icon: Truck, title: "Installation", body: "Coordination for delivery and professional setup of your equipment order." },
  { icon: Wrench, title: "Maintenance & AMC", body: "Annual maintenance contracts and ongoing support once you're up and running." },
  { icon: RefreshCw, title: "Upgrade & Replacement", body: "Refreshing or expanding an existing facility's equipment line-up." },
];

export default function CommercialSolutionsPage() {
  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Commercial Solutions" }]} />
      <h1 className="t-display mt-6 max-w-3xl text-primary">
        Fitting Out Gyms, Hotels &amp; Institutions
      </h1>
      <p className="mt-6 max-w-2xl t-body-lg text-on-surface-variant">
        For gyms, hotels, apartments, corporate offices, educational institutions, and
        physiotherapy centres — Afton supports equipment selection and bulk quotations
        from a single multi-brand catalogue.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-px border border-outline-variant bg-outline-variant sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-surface p-10">
            <Icon className="mb-8 h-10 w-10 text-accent" aria-hidden />
            <h2 className="t-headline-md mb-3 uppercase text-primary">{title}</h2>
            <p className="text-on-surface-variant">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col gap-8 bg-primary p-10 text-on-primary md:flex-row md:items-center md:justify-between md:p-16">
        <div className="max-w-lg">
          <h2 className="t-headline-lg text-on-primary">Planning a commercial project?</h2>
          <p className="mt-4 text-on-dark-muted">
            Share your requirements and we&apos;ll help put together an equipment plan
            and quotation.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/enquiry"
            className="flex items-center bg-accent px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
          >
            Request a Consultation
          </Link>
          <a
            href={buildWhatsAppLink("Hello Afton Fitness, I'm planning a commercial gym project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-whatsapp px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp Afton
          </a>
        </div>
      </div>
    </div>
  );
}
