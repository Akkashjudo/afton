import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getBrands, getCategories } from "@/lib/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Afton Fitness",
  description:
    "Since 1988, Afton Fitness has been one of India's leading suppliers of premium fitness equipment for homes, gyms, hotels, and institutions.",
};

export default function AboutPage() {
  const products = getAllProducts();
  const brands = getBrands();
  const categories = getCategories();
  const yearsActive = new Date().getFullYear() - siteConfig.established;

  const stats = [
    { value: `${yearsActive}+`, label: "Years of Experience" },
    { value: `${brands.length}`, label: "Fitness Brands" },
    { value: `${products.length}+`, label: "Products" },
    { value: `${categories.length}`, label: "Equipment Categories" },
  ];

  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <span className="t-label mt-6 block text-accent tracking-[0.2em]">
        EST. {siteConfig.established}
      </span>
      <h1 className="t-display mt-4 max-w-3xl text-primary">
        India&apos;s Premium Fitness Equipment Partner
      </h1>
      <p className="mt-6 max-w-2xl t-body-lg text-on-surface-variant">
        Since {siteConfig.established}, Afton Fitness has supplied premium fitness
        equipment for homes, commercial gyms, hotels, physiotherapy centres, Pilates
        studios, corporate wellness spaces, and educational institutions across India —
        representing global brands including Spirit, Sole, Impulse, REP Fitness, Eleiko,
        and Body-Solid.
      </p>

      <div className="mt-16 grid grid-cols-2 gap-px border border-outline-variant bg-outline-variant lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface p-8">
            <div className="t-display text-primary">{s.value}</div>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 border border-dashed border-outline-variant bg-surface-low p-8 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        Detailed company history, leadership, and full network details are being
        finalised with Afton and will be published here — this section intentionally
        avoids unverified claims in the meantime.
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/products" className="bg-primary px-10 py-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent">
          Explore Equipment
        </Link>
        <Link href="/contact" className="border border-primary px-10 py-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-on-primary">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
