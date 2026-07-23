import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { LinkedInIcon, YouTubeIcon } from "@/components/ui/SocialIcons";
import { getBrands, getCategories } from "@/lib/products";
import { Logo } from "./Logo";
import { BackToTop } from "./BackToTop";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { STORES } from "@/data/stores";
import { siteConfig, buildWhatsAppLink, fullAddress } from "@/lib/site-config";

export function Footer() {
  const categories = getCategories().slice(0, 6);
  const brands = getBrands().slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-on-dark">
      <div className="container-afton grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-4 md:py-20 lg:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Logo onDark />
          <p className="t-body-md mt-6 max-w-xs text-on-dark-muted">
            Premium fitness equipment solutions since {siteConfig.established}, for
            homes, gyms, hotels, and institutions across India.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialLink href={siteConfig.social.linkedin} label="Afton Fitness on LinkedIn">
              <LinkedInIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={siteConfig.social.youtube} label="Afton Fitness on YouTube">
              <YouTubeIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink
              href={buildWhatsAppLink("Hello Afton Fitness, I'd like to enquire about equipment.")}
              label="Chat with Afton on WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={`mailto:${siteConfig.contact.email}`} label="Email Afton Fitness">
              <Mail className="h-4 w-4" aria-hidden />
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Equipment">
          {categories.map((c) => (
            <FooterLink key={c.slug} href={`/category/${c.slug}`}>{c.name}</FooterLink>
          ))}
          <FooterLink href="/products">All Products</FooterLink>
        </FooterColumn>

        <FooterColumn title="Brands">
          {brands.map((b) => (
            <FooterLink key={b.slug} href={`/brand/${b.slug}`}>{b.name}</FooterLink>
          ))}
          <FooterLink href="/brands">All Brands</FooterLink>
        </FooterColumn>

        <FooterColumn title="Company">
          <FooterLink href="/commercial-solutions">Commercial Solutions</FooterLink>
          <FooterLink href="/store-locator">Store Locator ({STORES.length})</FooterLink>
          <FooterLink href="/#catalogue">Download Catalogue</FooterLink>
          <FooterLink href="/contact">Become a Dealer</FooterLink>
          <FooterLink href="/about">About Afton</FooterLink>
          <FooterLink href="/support">Support &amp; Service</FooterLink>
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="flex items-start gap-3">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <a
              href={`tel:${siteConfig.contact.salesPhoneHref}`}
              className="text-on-dark-muted transition-colors hover:text-white"
            >
              {siteConfig.contact.salesPhoneDisplay}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="break-all text-on-dark-muted transition-colors hover:text-white"
            >
              {siteConfig.contact.email}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <a
              href={siteConfig.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-dark-muted transition-colors hover:text-white"
            >
              {fullAddress()}
            </a>
          </li>
          <li className="pt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-on-dark-muted">
            {siteConfig.contact.hours}
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="container-afton flex flex-col items-center justify-between gap-5 py-7 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-dark-muted">
            © {year} Afton Fitness. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            <PolicyLink href="/support">Terms &amp; Conditions</PolicyLink>
            <PolicyLink href="/support">Privacy Policy</PolicyLink>
            <PolicyLink href="/support">Shipping &amp; Delivery</PolicyLink>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="t-label mb-6 text-white">{title}</h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-on-dark-muted transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}

function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-dark-muted transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center border border-white/20 text-on-dark-muted transition-colors hover:bg-white hover:text-primary"
    >
      {children}
    </a>
  );
}
