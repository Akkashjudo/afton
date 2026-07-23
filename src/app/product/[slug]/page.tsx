import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { toProductSummary } from "@/lib/products/summary";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductDescription } from "@/components/products/ProductDescription";
import { FeatureList } from "@/components/products/FeatureList";
import { SpecTable } from "@/components/products/SpecTable";
import { ProductActions } from "@/components/products/ProductActions";
import { ProductSubNav, type SubNavSection } from "@/components/products/ProductSubNav";
import { StickyEnquiryBar } from "@/components/products/StickyEnquiryBar";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { RecentlyViewedList } from "@/components/products/RecentlyViewedList";
import { RecentlyViewedTracker } from "@/components/products/RecentlyViewedTracker";
import { productSchema, breadcrumbSchema } from "@/lib/seo/schema";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const description =
    product.meta_description ?? product.description_text?.slice(0, 200) ?? undefined;
  const image = product.local_images[0]?.localPath;
  return {
    title: product.product_name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.product_name,
      description,
      url: `/product/${product.slug}`,
      ...(image ? { images: [{ url: image, alt: product.product_name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.product_name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Pull up to 4 "Key: Value" specs for the quick-stat box at the top. */
function quickStats(specs: string[]) {
  return specs
    .map((s) => {
      const i = s.indexOf(":");
      return i > 0 && i < 40 ? { label: s.slice(0, i).trim(), value: s.slice(i + 1).trim() } : null;
    })
    .filter((x): x is { label: string; value: string } => x !== null)
    .slice(0, 4);
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const summary = toProductSummary(product);
  const related = getRelatedProducts(product, 6).map(toProductSummary);
  const stats = quickStats(product.specifications);
  const hasFeatures = product.features.length > 0;
  const hasDownloads = product.pdf_links.length > 0;

  const sections: SubNavSection[] = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specifications" },
    ...(hasFeatures ? [{ id: "features", label: "Features" }] : []),
    ...(hasDownloads ? [{ id: "downloads", label: "Downloads" }] : []),
  ];

  const crumbs = [
    { label: "Home", href: "/" },
    ...(product.category
      ? [{ label: product.category, href: `/category/${product.categorySlug}` }]
      : []),
    { label: product.product_name },
  ];

  const jsonLd = productSchema({
    product_name: product.product_name,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    description: product.description_text ?? product.meta_description,
    images: product.local_images.map((img) => img.localPath),
    sku: summary.sku ?? null,
  });

  return (
    <div className="pb-28 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
      <RecentlyViewedTracker product={summary} />

      <div className="container-afton pt-28 md:pt-32">
        <div className="mb-8">
          <Breadcrumb items={crumbs} />
        </div>

        {/* Header: gallery + info */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ProductGallery productName={product.product_name} images={product.local_images} />
          </div>

          <div className="flex flex-col lg:col-span-5">
            {product.category && (
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                {product.category}
                {product.subcategory ? ` / ${product.subcategory}` : ""}
              </span>
            )}
            {product.brand && (
              <a
                href={`/brand/${product.brandSlug}`}
                className="mt-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-accent"
              >
                {product.brand}
              </a>
            )}
            <h1 className="t-headline-lg mt-2 uppercase leading-tight text-primary">
              {product.product_name}
            </h1>

            {product.description_text && (
              <p className="t-body-lg mt-6 max-w-md text-on-surface-variant line-clamp-4">
                {product.description_text}
              </p>
            )}

            {stats.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-6 border border-outline-variant bg-surface-low p-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                      {s.label}
                    </div>
                    <div className="t-headline-md mt-1 text-primary">{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <ProductActions product={summary} />
            </div>

            {product.ideal_for.length > 0 && (
              <div className="mt-8">
                <h2 className="t-label mb-3 text-on-surface-variant">Ideal For</h2>
                <ul className="flex flex-wrap gap-2">
                  {product.ideal_for.map((use, i) => (
                    <li key={i} className="border border-outline-variant px-3 py-1 font-mono text-[11px] uppercase tracking-wide">
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="mt-8">
                <h2 className="t-label mb-3 text-on-surface-variant">Variants</h2>
                <ul className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <li key={i} className="border border-outline-variant px-3 py-1 font-mono text-[11px] uppercase tracking-wide">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <ProductSubNav sections={sections} />

        {/* Overview */}
        <section id="overview" className="grid grid-cols-1 gap-8 pt-20 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="t-headline-lg uppercase text-primary">Overview</h2>
          </div>
          <div className="md:col-span-8">
            <ProductDescription
              descriptionText={product.description_text}
              descriptionHtml={product.description_html}
              status={product.description_status}
            />
          </div>
        </section>

        {/* Specifications */}
        <section id="specs" className="grid grid-cols-1 gap-8 pt-20 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="t-headline-lg uppercase text-primary">Technical Specifications</h2>
          </div>
          <div className="md:col-span-8">
            <SpecTable specifications={product.specifications} />
          </div>
        </section>

        {/* Features */}
        {hasFeatures && (
          <section id="features" className="grid grid-cols-1 gap-8 pt-20 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="t-headline-lg uppercase text-primary">Key Features</h2>
            </div>
            <div className="md:col-span-8">
              <FeatureList features={product.features} />
            </div>
          </section>
        )}

        {/* Downloads */}
        {hasDownloads && (
          <section id="downloads" className="grid grid-cols-1 gap-8 pt-20 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="t-headline-lg uppercase text-primary">Downloads</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:col-span-8">
              {product.pdf_links.map((pdf, i) => (
                <a
                  key={i}
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-outline-variant bg-white p-6 transition-colors hover:border-primary"
                >
                  <span className="t-headline-md uppercase text-primary">
                    {pdf.text || "Download brochure"}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <RelatedProducts products={related.slice(0, 6)} />

      <div className="container-afton">
        <RecentlyViewedList excludeSlug={product.slug} />
      </div>

      <StickyEnquiryBar product={summary} />
    </div>
  );
}
