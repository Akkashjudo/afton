import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getProductsByCategory } from "@/lib/products";
import { toProductSummary } from "@/lib/products/summary";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryBrowser } from "@/components/products/CategoryBrowser";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategories().find((c) => c.slug === categorySlug);
  if (!category) return {};
  return {
    title: `${category.name}`,
    description: `Browse ${category.count} ${category.name} products from Afton Fitness — multi-brand gym and fitness equipment for home and commercial use across India.`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const categorySummary = getCategories().find((c) => c.slug === categorySlug);
  if (!categorySummary) notFound();

  const products = getProductsByCategory(categorySlug);
  const summaries = products.map(toProductSummary);

  const brandCounts = new Map<string, { name: string; slug: string; count: number }>();
  for (const p of products) {
    if (!p.brand || !p.brandSlug) continue;
    if (!brandCounts.has(p.brandSlug)) {
      brandCounts.set(p.brandSlug, { name: p.brand, slug: p.brandSlug, count: 0 });
    }
    brandCounts.get(p.brandSlug)!.count += 1;
  }
  const brandOptions = [...brandCounts.values()].sort((a, b) => b.count - a.count);

  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: categorySummary.name },
        ]}
      />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">{categorySummary.name}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        Showing {categorySummary.count} High-Performance Machines
      </p>

      <div className="mt-10">
        <CategoryBrowser
          products={summaries}
          brandOptions={brandOptions}
          subcategoryOptions={categorySummary.subcategories}
        />
      </div>
    </div>
  );
}
