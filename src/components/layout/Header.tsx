import { getAllProducts, getBrands, getCategories } from "@/lib/products";
import { toSearchEntry } from "@/lib/products/summary";
import { HeaderBar } from "./HeaderBar";

/**
 * Server shell for the header: reads the catalogue on the server and hands the
 * client bar only what it needs — nav taxonomy plus a trimmed search index
 * (name/brand/category/slug/thumbnail), never the full product records.
 */
export function Header() {
  const categories = getCategories();
  const brands = getBrands();
  const searchIndex = getAllProducts().map(toSearchEntry);

  return <HeaderBar categories={categories} brands={brands} searchIndex={searchIndex} />;
}
