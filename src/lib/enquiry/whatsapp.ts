import type { EnquiryItem } from "./types";
import { siteConfig } from "@/lib/site-config";

type BuildMessageOptions = {
  usage?: string;
  location?: string;
  name?: string;
  phone?: string;
  email?: string;
  note?: string;
};

const SITE = `https://${siteConfig.domain}`;

/** Canonical public URL for a product on the new site. */
export function productUrl(slug: string): string {
  return `${SITE}/product/${slug}`;
}

/**
 * Structured multi-product quotation request. Each line carries the product
 * name, its model/SKU where we have one, quantity, and a direct link, so the
 * sales team can act on the message without asking follow-up questions.
 * Pure function — deterministic and unit-testable.
 */
export function buildWhatsAppMessage(
  items: EnquiryItem[],
  options: BuildMessageOptions = {},
): string {
  const lines: string[] = [
    "Hello Afton Fitness,",
    "",
    "I would like a quotation for the following equipment:",
    "",
  ];

  items.forEach((item, index) => {
    const variant = item.variant ? ` (${item.variant})` : "";
    lines.push(`${index + 1}. ${item.product_name}${variant} — Qty: ${item.quantity}`);
    if (item.sku) lines.push(`   Model: ${item.sku}`);
    if (item.brand) lines.push(`   Brand: ${item.brand}`);
    lines.push(`   ${productUrl(item.slug)}`);
    lines.push("");
  });

  if (options.usage) lines.push(`Usage: ${options.usage}`);
  if (options.location) lines.push(`Location: ${options.location}`);
  if (options.note) lines.push(`Notes: ${options.note}`);
  lines.push(`Name: ${options.name ?? ""}`);
  lines.push(`Phone: ${options.phone ?? ""}`);
  if (options.email) lines.push(`Email: ${options.email}`);

  return lines.join("\n");
}

/** Single-product enquiry, with the same structured detail. */
export function buildProductEnquiryMessage(product: {
  product_name: string;
  slug: string;
  brand?: string | null;
  sku?: string | null;
  quantity?: number;
  question?: string;
}): string {
  const lines = [
    "Hello Afton Fitness,",
    "",
    `I'm interested in: ${product.product_name}`,
  ];
  if (product.brand) lines.push(`Brand: ${product.brand}`);
  if (product.sku) lines.push(`Model: ${product.sku}`);
  if (product.quantity && product.quantity > 1) lines.push(`Quantity: ${product.quantity}`);
  lines.push(productUrl(product.slug));
  if (product.question) {
    lines.push("");
    lines.push(product.question);
  }
  lines.push("", "Please share pricing and availability.");
  return lines.join("\n");
}
