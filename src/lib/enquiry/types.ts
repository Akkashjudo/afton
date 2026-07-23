export type EnquiryItem = {
  slug: string;
  product_name: string;
  brand: string | null;
  category: string | null;
  product_url: string;
  image?: string;
  /** Model/SKU parsed from the product's own specifications, when present. */
  sku?: string | null;
  variant?: string;
  quantity: number;
};
