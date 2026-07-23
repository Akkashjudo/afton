import { siteConfig, fullAddress } from "@/lib/site-config";

export const SITE_URL = `https://${siteConfig.domain}`;

/** Organization + contact point, emitted once in the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/afton-logo.png`,
    foundingDate: String(siteConfig.established),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.salesPhoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.pincode,
      addressCountry: "IN",
    },
    sameAs: [siteConfig.social.linkedin, siteConfig.social.youtube],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.salesPhoneDisplay,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Tamil", "Hindi"],
      },
    ],
    description: `Afton Fitness has supplied premium fitness equipment across India since ${siteConfig.established}. ${fullAddress()}`,
  };
}

/** Breadcrumb trail — pass the same items rendered in the visible breadcrumb. */
export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

/**
 * Product schema. Deliberately omits price/availability/rating — Afton's
 * catalogue is enquiry-based and inventing those would be false structured
 * data. Only fields backed by real scraped content are emitted.
 */
export function productSchema(product: {
  product_name: string;
  slug: string;
  brand: string | null;
  category: string | null;
  description: string | null;
  images: string[];
  sku: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product_name,
    url: `${SITE_URL}/product/${product.slug}`,
    ...(product.description ? { description: product.description } : {}),
    ...(product.category ? { category: product.category } : {}),
    ...(product.sku ? { sku: product.sku, mpn: product.sku } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    image: product.images.map((src) => `${SITE_URL}${src}`),
  };
}
