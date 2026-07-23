import { sanitizeDescriptionHtml } from "@/lib/utils/sanitize";

export function ProductDescription({
  descriptionText,
  descriptionHtml,
  status,
}: {
  descriptionText: string | null;
  descriptionHtml: string | null;
  status: "ok" | "missing";
}) {
  if (status === "missing" || (!descriptionText && !descriptionHtml)) {
    return (
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        Contact Afton for complete product details.
      </p>
    );
  }

  if (descriptionText) {
    const paragraphs = descriptionText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    return (
      <div className="space-y-6 t-body-lg text-on-surface-variant">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  }

  return (
    <div
      className="space-y-6 t-body-lg text-on-surface-variant [&_a]:underline [&_li]:ml-4 [&_li]:list-disc"
      dangerouslySetInnerHTML={{ __html: sanitizeDescriptionHtml(descriptionHtml!) }}
    />
  );
}
