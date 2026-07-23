import Image from "next/image";
import Link from "next/link";
import type { LocalImage } from "@/types/product";
import { Reveal } from "@/components/motion/Reveal";

export type BentoCategory = {
  index: string;
  name: string;
  slug: string;
  count: number;
  image?: LocalImage;
};

export function CategoryBento({ categories }: { categories: BentoCategory[] }) {
  const [c1, c2, c3, c4] = categories;

  return (
    <section className="section-gap bg-surface">
      <div className="container-afton">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="t-label mb-4 block text-on-surface-variant">Collections</span>
            <h2 className="t-headline-lg text-primary">Shop By Category</h2>
          </div>
          <Link
            href="/products"
            className="t-label border-b border-primary pb-1 text-primary transition-colors hover:border-accent hover:text-accent"
          >
            View All Categories
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* 01 — large feature */}
          {c1 && (
            <BentoTile category={c1} className="md:col-span-8" height="h-[500px]" bg="bg-technical">
              {c1.image && (
                <Image
                  src={c1.image.localPath}
                  alt=""
                  width={c1.image.width}
                  height={c1.image.height}
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="absolute bottom-0 right-0 h-4/5 w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </BentoTile>
          )}

          {/* 02 — tall */}
          {c2 && (
            <BentoTile category={c2} className="md:col-span-4" height="h-[500px]" bg="bg-surface-low" column>
              {c2.image && (
                <div className="mt-auto">
                  <Image
                    src={c2.image.localPath}
                    alt=""
                    width={c2.image.width}
                    height={c2.image.height}
                    sizes="30vw"
                    className="h-64 w-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              )}
            </BentoTile>
          )}

          {/* 03 — small */}
          {c3 && (
            <BentoTile category={c3} className="md:col-span-4" height="h-[400px]" bg="bg-surface-low" column>
              {c3.image && (
                <div className="flex flex-grow items-center justify-center p-4">
                  <Image
                    src={c3.image.localPath}
                    alt=""
                    width={c3.image.width}
                    height={c3.image.height}
                    sizes="30vw"
                    className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:rotate-2"
                  />
                </div>
              )}
            </BentoTile>
          )}

          {/* 04 — medium */}
          {c4 && (
            <BentoTile category={c4} className="md:col-span-8" height="h-[400px]" bg="bg-technical" row>
              {c4.image && (
                <Image
                  src={c4.image.localPath}
                  alt=""
                  width={c4.image.width}
                  height={c4.image.height}
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="h-full w-auto object-contain transition-transform duration-700 group-hover:-translate-x-4"
                />
              )}
            </BentoTile>
          )}
        </div>
      </div>
    </section>
  );
}

function BentoTile({
  category,
  className,
  height,
  bg,
  column,
  row,
  children,
}: {
  category: BentoCategory;
  className: string;
  height: string;
  bg: string;
  column?: boolean;
  row?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/category/${category.slug}`} className={`group cursor-pointer overflow-hidden ${className}`}>
      <div
        className={`relative ${height} ${bg} p-10 md:p-12 ${
          row ? "flex items-center justify-between overflow-hidden" : column ? "flex flex-col" : "flex flex-col justify-between"
        }`}
      >
        <div className={`relative z-10 ${row ? "max-w-[200px]" : ""}`}>
          <span className="t-label text-on-surface-variant">{category.index} / CATEGORY</span>
          <h3 className="t-headline-md mt-2 text-primary transition-transform group-hover:translate-x-2">
            {category.name}
          </h3>
          <p className="t-label mt-4 text-accent">{category.count} PRODUCTS</p>
        </div>
        {children}
      </div>
    </Link>
  );
}
