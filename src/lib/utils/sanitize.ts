import sanitizeHtml from "sanitize-html";

/** Strips inline styles/scripts from legacy scraped HTML — keeps semantic
 * tags only, so descriptions render in our own typography instead of the
 * old site's inline font/colour overrides. */
export function sanitizeDescriptionHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "span",
      "div",
      "a",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
