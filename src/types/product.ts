import { z } from "zod";

export const LocalImageSchema = z.object({
  fileName: z.string(),
  localPath: z.string(),
  width: z.number(),
  height: z.number(),
  fileSizeBytes: z.number(),
  sourceUrl: z.string().nullable().optional(),
  lowResolutionFallback: z.boolean(),
});

export const PdfLinkSchema = z.object({
  url: z.string(),
  text: z.string(),
});

export const ProductSchema = z.object({
  product_name: z.string(),
  slug: z.string(),
  brand: z.string().nullable(),
  brandSlug: z.string().nullable(),
  category: z.string().nullable(),
  categorySlug: z.string().nullable(),
  subcategory: z.string().nullable(),
  subcategorySlug: z.string().nullable(),
  rawCategory: z.string().nullable(),
  rawSubcategory: z.string().nullable(),
  categorySource: z.enum(["source", "inferred", "inferred-default"]),
  product_url: z.string(),
  breadcrumb: z.array(z.string()),
  page_title: z.string(),
  meta_description: z.string().nullable(),
  description_text: z.string().nullable(),
  description_html: z.string().nullable(),
  features: z.array(z.string()),
  specifications: z.array(z.string()),
  ideal_for: z.array(z.string()),
  variants: z.array(z.string()),
  pdf_links: z.array(PdfLinkSchema),
  local_images: z.array(LocalImageSchema),
  image_count: z.number(),
  scrape_status: z.literal("success"),
  missing_fields: z.array(z.string()),
  description_status: z.enum(["ok", "missing"]),
  specifications_status: z.enum(["ok", "missing"]),
});

export type Product = z.infer<typeof ProductSchema>;
export type LocalImage = z.infer<typeof LocalImageSchema>;

export type ProductSummary = {
  slug: string;
  product_name: string;
  brand: string | null;
  brandSlug: string | null;
  category: string | null;
  categorySlug: string | null;
  subcategory: string | null;
  subcategorySlug: string | null;
  product_url: string;
  image_count: number;
  primaryImage?: LocalImage;
  /** Model/SKU read out of the product's own specifications, if stated. */
  sku?: string | null;
};

export type CategorySummary = {
  name: string;
  slug: string;
  count: number;
  subcategories: { name: string; slug: string; count: number }[];
};

export type BrandSummary = {
  name: string;
  slug: string;
  count: number;
};
