import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrands, getProductsByBrand } from "@/lib/products";
import { toProductSummary } from "@/lib/products/summary";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryBrowser } from "@/components/products/CategoryBrowser";

type Params = Promise<{ brand: string }>;

export function generateStaticParams() {
  return getBrands().map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = getBrands().find((b) => b.slug === brandSlug);
  if (!brand) return {};
  return {
    title: `${brand.name} Fitness Equipment`,
    description: `Browse ${brand.count} ${brand.name} products available through Afton Fitness — multi-brand gym and fitness equipment for home and commercial use across India.`,
  };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand: brandSlug } = await params;
  const brandSummary = getBrands().find((b) => b.slug === brandSlug);
  if (!brandSummary) notFound();

  const products = getProductsByBrand(brandSlug);
  const summaries = products.map(toProductSummary);

  const categoryCounts = new Map<string, { name: string; slug: string; count: number }>();
  for (const p of products) {
    if (!p.category || !p.categorySlug) continue;
    if (!categoryCounts.has(p.categorySlug)) {
      categoryCounts.set(p.categorySlug, { name: p.category, slug: p.categorySlug, count: 0 });
    }
    categoryCounts.get(p.categorySlug)!.count += 1;
  }
  const categoryOptions = [...categoryCounts.values()].sort((a, b) => b.count - a.count);

  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brandSummary.name },
        ]}
      />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">{brandSummary.name}</h1>
      <p className="mt-2 max-w-2xl font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        {brandSummary.count} products · {categoryOptions.length} categor
        {categoryOptions.length === 1 ? "y" : "ies"}
      </p>

      <div className="mt-10">
        <CategoryBrowser products={summaries} categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
