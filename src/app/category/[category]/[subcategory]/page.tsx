import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getProductsByCategory } from "@/lib/products";
import { toProductSummary } from "@/lib/products/summary";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryBrowser } from "@/components/products/CategoryBrowser";

type Params = Promise<{ category: string; subcategory: string }>;

export function generateStaticParams() {
  return getCategories().flatMap((c) =>
    c.subcategories.map((s) => ({ category: c.slug, subcategory: s.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const category = getCategories().find((c) => c.slug === categorySlug);
  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug);
  if (!category || !subcategory) return {};
  return {
    title: `${subcategory.name} — ${category.name}`,
    description: `Browse ${subcategory.count} ${subcategory.name} products in ${category.name} from Afton Fitness.`,
  };
}

export default async function SubcategoryPage({ params }: { params: Params }) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const categorySummary = getCategories().find((c) => c.slug === categorySlug);
  const subcategorySummary = categorySummary?.subcategories.find(
    (s) => s.slug === subcategorySlug,
  );
  if (!categorySummary || !subcategorySummary) notFound();

  const products = getProductsByCategory(categorySlug, subcategorySlug);
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
          { label: categorySummary.name, href: `/category/${categorySummary.slug}` },
          { label: subcategorySummary.name },
        ]}
      />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">{subcategorySummary.name}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        {subcategorySummary.count} products in {categorySummary.name}
      </p>

      <div className="mt-10">
        <CategoryBrowser products={summaries} brandOptions={brandOptions} />
      </div>
    </div>
  );
}
