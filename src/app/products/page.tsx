import type { Metadata } from "next";
import { getAllProducts, getBrands, getCategories } from "@/lib/products";
import { toProductSummary } from "@/lib/products/summary";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryBrowser } from "@/components/products/CategoryBrowser";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse the full Afton Fitness catalogue — gym and fitness equipment across every category and brand.",
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = getAllProducts();
  const summaries = products.map(toProductSummary);
  const brandOptions = getBrands();
  const categoryOptions = getCategories().map((c) => ({ name: c.name, slug: c.slug, count: c.count }));

  return (
    <div className="container-afton pt-28 pb-24 md:pt-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "All Products" }]} />
      <h1 className="t-headline-lg mt-6 uppercase text-primary">All Products</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        Showing {products.length} High-Performance Machines
      </p>

      <div className="mt-10">
        <CategoryBrowser
          products={summaries}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          initialSearch={q}
        />
      </div>
    </div>
  );
}
