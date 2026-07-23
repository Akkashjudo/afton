import Link from "next/link";
import { getCategories } from "@/lib/products";

export default function NotFound() {
  const categories = getCategories().slice(0, 6);

  return (
    <div className="container-afton pt-40 pb-32 text-center">
      <p className="t-label text-accent tracking-[0.2em]">404</p>
      <h1 className="t-display mt-4 text-primary">Page Not Found</h1>
      <p className="mx-auto mt-4 max-w-md t-body-lg text-on-surface-variant">
        The page you&apos;re looking for may have moved. Search the catalogue, browse a
        category, or head back home.
      </p>

      <form action="/products" className="mx-auto mt-8 flex max-w-md">
        <input
          type="text"
          name="q"
          placeholder="Search products…"
          className="w-full border border-outline-variant bg-white px-4 py-3 font-body text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent"
        >
          Search
        </button>
      </form>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="border border-outline-variant px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:border-primary"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="bg-primary px-10 py-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent">
          Back to Homepage
        </Link>
        <Link href="/contact" className="border border-primary px-10 py-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-on-primary">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
