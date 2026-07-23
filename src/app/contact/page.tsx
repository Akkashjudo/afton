import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, buildWhatsAppLink, fullAddress } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Afton Fitness — Chennai Experience Centre, sales, service, and commercial gym enquiries across India.",
};

export default function ContactPage() {
  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">Get In Touch</h1>
      <p className="mt-3 max-w-xl t-body-lg text-on-surface-variant">
        Speak with our fitness equipment specialists, or visit the Chennai Experience
        Centre to see the range in person.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <ContactRow icon={Phone} label="Phone">
            <a href={`tel:${siteConfig.contact.salesPhoneHref}`} className="hover:text-accent">
              {siteConfig.contact.salesPhoneDisplay}
            </a>
          </ContactRow>
          <ContactRow icon={Mail} label="Email">
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-accent">
              {siteConfig.contact.email}
            </a>
          </ContactRow>
          <ContactRow icon={MapPin} label="Chennai Experience Centre">
            <a href={siteConfig.contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              {fullAddress()}
            </a>
          </ContactRow>
          <ContactRow icon={Clock} label="Business Hours">
            {siteConfig.contact.hours}
          </ContactRow>

          <a
            href={buildWhatsAppLink("Hello Afton Fitness, I'd like to enquire about equipment.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-whatsapp px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp Us
          </a>
        </div>

        <div className="border border-outline-variant bg-white p-8">
          <span className="t-label mb-6 block text-on-surface-variant tracking-[0.2em]">
            Send a Message
          </span>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-b border-outline-variant pb-6">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden />
      <div>
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
          {label}
        </div>
        <div className="mt-1 font-body text-base text-primary">{children}</div>
      </div>
    </div>
  );
}
