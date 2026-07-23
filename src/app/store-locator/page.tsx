import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StoreLocator } from "@/components/stores/StoreLocator";
import { STORES, STATES } from "@/data/stores";
import { siteConfig, fullAddress } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Store Locator",
  description:
    "Find your nearest Afton Fitness experience centre, authorised store, or service centre across India — with direct call, WhatsApp, and directions.",
  alternates: { canonical: "/store-locator" },
};

export default function StoreLocatorPage() {
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Afton Chennai Experience Centre",
    image: "/brand/afton-logo.png",
    telephone: siteConfig.contact.salesPhoneDisplay,
    email: siteConfig.contact.email,
    url: `https://${siteConfig.domain}/store-locator`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.pincode,
      addressCountry: "IN",
    },
    parentOrganization: { "@type": "Organization", name: "Afton Fitness" },
  };

  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store Locator" }]} />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">Store Locator</h1>
      <p className="mt-3 max-w-2xl t-body-lg text-on-surface-variant">
        {STORES.length} experience centres, authorised stores, and service centres across{" "}
        {STATES.length} states. Find your nearest location and talk to the team directly.
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        Head Office — {fullAddress()}
      </p>

      <div className="mt-10">
        <StoreLocator />
      </div>
    </div>
  );
}
