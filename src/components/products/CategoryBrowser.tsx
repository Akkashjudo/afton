"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, SlidersHorizontal, X } from "lucide-react";
import type { ProductSummary } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils/cn";

type FacetOption = { name: string; slug: string; count: number };
type SortOption = "featured" | "name-asc" | "name-desc" | "most-images";

const PAGE_SIZE = 24;

export function CategoryBrowser({
  products,
  brandOptions,
  subcategoryOptions,
  categoryOptions,
  initialSearch,
}: {
  products: ProductSummary[];
  brandOptions?: FacetOption[];
  subcategoryOptions?: FacetOption[];
  categoryOptions?: FacetOption[];
  initialSearch?: string;
}) {
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch ?? "");
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedBrands.size > 0) result = result.filter((p) => p.brandSlug && selectedBrands.has(p.brandSlug));
    if (selectedSubcategory) result = result.filter((p) => p.subcategorySlug === selectedSubcategory);
    if (selectedCategory) result = result.filter((p) => p.categorySlug === selectedCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.product_name.toLowerCase().includes(q));
    }
    const sorted = [...result];
    if (sort === "name-asc") sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
    if (sort === "name-desc") sorted.sort((a, b) => b.product_name.localeCompare(a.product_name));
    if (sort === "most-images") sorted.sort((a, b) => b.image_count - a.image_count);
    if (sort === "featured") sorted.sort((a, b) => b.image_count - a.image_count);
    return sorted;
  }, [products, selectedBrands, selectedSubcategory, selectedCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  function toggleBrand(slug: string) {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    resetPage();
  }

  const activeChips: { label: string; onRemove: () => void }[] = [];
  for (const slug of selectedBrands) {
    const b = brandOptions?.find((x) => x.slug === slug);
    if (b) activeChips.push({ label: b.name, onRemove: () => toggleBrand(slug) });
  }
  if (selectedSubcategory) {
    const s = subcategoryOptions?.find((x) => x.slug === selectedSubcategory);
    if (s) activeChips.push({ label: s.name, onRemove: () => { setSelectedSubcategory(null); resetPage(); } });
  }
  if (selectedCategory) {
    const c = categoryOptions?.find((x) => x.slug === selectedCategory);
    if (c) activeChips.push({ label: c.name, onRemove: () => { setSelectedCategory(null); resetPage(); } });
  }

  const filterPanel = (
    <div className="space-y-10">
      {subcategoryOptions && subcategoryOptions.length > 0 && (
        <FilterGroup title="Equipment Type">
          {subcategoryOptions.map((sub) => (
            <FilterCheckbox
              key={sub.slug}
              label={sub.name}
              count={sub.count}
              checked={selectedSubcategory === sub.slug}
              onChange={() => {
                setSelectedSubcategory((p) => (p === sub.slug ? null : sub.slug));
                resetPage();
              }}
            />
          ))}
        </FilterGroup>
      )}

      {categoryOptions && categoryOptions.length > 0 && (
        <FilterGroup title="Category">
          {categoryOptions.map((cat) => (
            <FilterCheckbox
              key={cat.slug}
              label={cat.name}
              count={cat.count}
              checked={selectedCategory === cat.slug}
              onChange={() => {
                setSelectedCategory((p) => (p === cat.slug ? null : cat.slug));
                resetPage();
              }}
            />
          ))}
        </FilterGroup>
      )}

      {brandOptions && brandOptions.length > 0 && (
        <FilterGroup title="Brands">
          {brandOptions.map((brand) => (
            <FilterCheckbox
              key={brand.slug}
              label={brand.name}
              count={brand.count}
              checked={selectedBrands.has(brand.slug)}
              onChange={() => toggleBrand(brand.slug)}
            />
          ))}
        </FilterGroup>
      )}
    </div>
  );

  return (
    <div>
      {/* Controls bar */}
      <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search this collection…"
            aria-label="Search products"
            className="w-full max-w-xs border border-outline-variant bg-white px-4 py-2 font-body text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 border border-outline-variant px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
          </button>
        </div>
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-outline-variant bg-white px-3 py-2 font-mono text-xs uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="featured">Featured</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
            <option value="most-images">Most Photographed</option>
          </select>
        </label>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 border border-outline-variant bg-white px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] hover:border-primary"
            >
              {chip.label}
              <X className="h-3 w-3" aria-hidden />
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-10">
        <aside className="hidden w-72 flex-shrink-0 lg:block">{filterPanel}</aside>

        <div className="min-w-0 flex-grow">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <p className="t-headline-md text-primary">No products match these filters</p>
              <p className="text-sm text-on-surface-variant">Try removing a filter or searching for something else.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((product, i) => (
                  <ProductCard key={product.slug} product={product} priority={i < 3} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[86vw] max-w-sm overflow-y-auto border-l border-outline-variant bg-surface p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="t-label text-on-surface-variant">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center hover:bg-surface-container"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full bg-primary py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="t-label border-b border-outline-variant pb-2 text-primary">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-0.5">
      <span className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded-none border-outline-variant text-primary focus:ring-0"
        />
        <span className={cn("font-body text-sm", checked ? "text-primary" : "text-on-surface-variant")}>{label}</span>
      </span>
      <span className="font-mono text-[11px] text-outline">{count}</span>
    </label>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div className="mt-16 flex items-center justify-between border-t border-outline-variant pt-8">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => { onChange(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:text-primary disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Previous
      </button>
      <div className="flex items-center gap-4">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="text-on-surface-variant">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => { onChange(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={cn(
                "font-mono text-sm",
                p === page ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:text-primary",
              )}
            >
              {String(p).padStart(2, "0")}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => { onChange(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:text-primary disabled:opacity-40"
      >
        Next <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
