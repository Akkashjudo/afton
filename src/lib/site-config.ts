/**
 * Single source of truth for Afton's real contact/CTA details, used across
 * the header, footer, contact page, product pages, and WhatsApp/enquiry links.
 */
export const siteConfig = {
  name: "Afton Fitness",
  domain: "afton.in",
  established: 1988,
  contact: {
    salesPhoneDisplay: "+91 94451 63701",
    salesPhoneHref: "+919445163701",
    whatsappNumber: "919445163701", // digits only, used in wa.me links
    email: "sales@aftonfitness.com",
    address: {
      line1: "2nd Floor, SCM Jamaludeen Chambers",
      line2: "4, Montieth Road, Egmore",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600008",
    },
    addressShort: "Chennai, Tamil Nadu, India",
    hours: "Mon–Sat, 10:00 AM – 7:00 PM",
    mapsUrl:
      "https://www.google.com/maps/place/Afton+Treadmill+%26+Gym+Equipment+Store/@13.0679047,80.2582913,15z/data=!4m5!3m4!1s0x0:0xa45a3af8bd5325fc!8m2!3d13.0679047!4d80.2582913",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/aftonfitness/",
    youtube: "https://www.youtube.com/c/AftonFitnessEquipment",
  },
} as const;

export function buildWhatsAppLink(message: string): string {
  const number = siteConfig.contact.whatsappNumber;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function fullAddress(): string {
  const a = siteConfig.contact.address;
  return `${a.line1}, ${a.line2}, ${a.city}, ${a.state} – ${a.pincode}`;
}
