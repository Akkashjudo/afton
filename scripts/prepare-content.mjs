// One-time content preparation pipeline.
//
// Reads the raw scrape output from the audit tool (never modified) and writes:
//   src/data/products.json     — cleaned, deduped, categorized product catalogue
//   src/data/redirects.json    — old-slug -> canonical-slug map (duplicate names)
//   src/data/locations.json    — excluded dealer/store-locator pages (raw, for a
//                                 possible future store-locator page)
//   src/data/qa-report.json    — low-res / duplicate-image / unclassified flags
//   public/products/<slug>/*   — copied + renamed product images
//
// Run with: node scripts/prepare-content.mjs

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOT =
  "C:\\Users\\AKKASH RAJ\\Desktop\\client projects\\afton project";
const SOURCE_PRODUCTS_JSON = path.join(SOURCE_ROOT, "data", "products.json");

const OUT_DATA_DIR = path.join(APP_ROOT, "src", "data");
const OUT_PUBLIC_DIR = path.join(APP_ROOT, "public", "products");

// ---------------------------------------------------------------------------
// 1. Brand canonicalization
// ---------------------------------------------------------------------------
// Source data has ALL-CAPS scrape artifacts and one real casing duplicate
// (AFTON / Afton). This only fixes display casing/hyphenation of brand names
// that already exist in the data — it does not invent or merge unrelated brands.
const BRAND_CANONICAL = {
  IMPULSE: "Impulse",
  AFTON: "Afton",
  Afton: "Afton",
  SPIRIT: "Spirit",
  "BODY SOLID": "Body-Solid",
  "DYACO REHAB": "Dyaco Rehab",
  "REP FITNESS": "REP Fitness",
  SOLE: "Sole",
  STEX: "Stex",
  XTERRA: "XTERRA",
  "AFTON SERVICE": "Afton Service",
  ELEIKO: "Eleiko",
  "CONCEPT 2": "Concept2",
  HMC: "HMC",
  "SPIRIT MEDICAL": "Spirit Medical",
  WNQ: "WNQ",
  BRUTEFORCE: "BruteForce",
  XEBEX: "Xebex",
  VO2MASTER: "VO2 Master",
  "BEYOND POWER": "Beyond Power",
};

function canonicalBrand(rawBrand) {
  if (!rawBrand) return null;
  return BRAND_CANONICAL[rawBrand] ?? rawBrand;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// 2. Exclude non-product pages
// ---------------------------------------------------------------------------
// 25+ entries are city/dealer store-locator landing pages that share the
// /product/<slug> URL pattern with real products but are not equipment.
// Most carry the "Authorised Dealers" category, but at least one has a null
// category (shallow breadcrumb) — so also match on the name pattern itself.
const EXCLUDED_SOURCE_CATEGORY = "Authorised Dealers – Afton Fitness";
const DEALER_PAGE_PATTERN =
  /fitness equipment store|gym equipment store|equipment showroom|authorised dealer/i;

// The "AFTON SERVICE" brand is entirely service-centre listings (sales/service
// phone numbers per city), not equipment. Those numbers are surfaced properly
// on the Store Locator page instead, so they're excluded from the catalogue.
const EXCLUDED_SOURCE_BRANDS = new Set(["AFTON SERVICE"]);
const SERVICE_LISTING_PATTERN =
  /sales\s*&?\s*service centre|service centre in|treadmill sales|sales \d{10}/i;

function isDealerPage(p) {
  return (
    p.category === EXCLUDED_SOURCE_CATEGORY ||
    DEALER_PAGE_PATTERN.test(p.product_name) ||
    EXCLUDED_SOURCE_BRANDS.has((p.brand || "").trim()) ||
    SERVICE_LISTING_PATTERN.test(p.product_name)
  );
}

// ---------------------------------------------------------------------------
// 3. Category normalization
// ---------------------------------------------------------------------------
// Source `category` is the site's own breadcrumb segment. For ~500 products
// it's a real category. For ~160 it's actually a brand/series name that
// landed in the category slot (shallow breadcrumb), and for ~195 it's absent.
// This map + the keyword fallback below reclassify using the same underlying
// signal (breadcrumb/product name) — nothing here is invented content.

const REAL_CATEGORY_MAP = {
  "Selectorised": ["Strength Training", "Selectorised Machines"],
  "Commercial Gym Equipment": ["Commercial Gym Equipment", null],
  "Pilates Equipment – Reformers, Cadillacs & Towers": [
    "Rehab & Wellness",
    "Pilates Equipment",
  ],
  "Home Fitness Equipment": ["Home Fitness", null],
  "Rehab Equipment for Stroke & ACL Recovery": [
    "Rehab & Wellness",
    "Rehab Equipment",
  ],
  "Power Racks, Squat Stands & Lifting Cages": [
    "Strength Training",
    "Racks, Stands & Cages",
  ],
  "Plate Loaded Strength Equipment": [
    "Strength Training",
    "Plate-Loaded Equipment",
  ],
  "Hydraulic Fitness": ["Strength Training", "Hydraulic Circuit Equipment"],
  "Multi Gyms & Home Gym Setups": ["Home Fitness", "Multi Gyms"],
  "Strength Training Equipment": ["Strength Training", null],
  "Spares and Service": ["Accessories & Service", null],
  "Exercise Bikes": ["Cardio", "Exercise Bikes"],
  "Afton Gym Rubber Flooring": ["Flooring & Storage", null],
  "BMI Machines": ["Rehab & Wellness", "Body Composition"],
  "Barbells – Olympic, Powerlifting & Specialty Bars": [
    "Free Weights",
    "Barbells",
  ],
  "Elliptical Cross Trainers": ["Cardio", "Elliptical Trainers"],
  "Treadmills": ["Cardio", "Treadmills"],
  "Weight Plates & Kettlebells– Bumper, Competition, Fleck & Steel": [
    "Free Weights",
    "Plates & Kettlebells",
  ],
  "Teeter Inversion Table": ["Rehab & Wellness", "Inversion Tables"],
  "Hyrox Training Equipment": ["Functional Training", "Hyrox Equipment"],
  "Functional Trainers & Cable Machines": [
    "Functional Training",
    "Cable Machines",
  ],
  "Cardio Equipment": ["Cardio", null],
  "Interactive Training Tiles": ["Functional Training", "Training Tiles"],
  "TRX YBell Fitness": ["Functional Training", "Suspension & YBell Training"],
  "Indoor Rowing Machines": ["Cardio", "Rowing Machines"],
  "Commercial Treadmills": ["Cardio", "Treadmills"],
  "EXER ROW Rowing Machine": ["Cardio", "Rowing Machines"],
  "EXER STEP Stepping Machine": ["Cardio", "Steppers & Climbers"],
};

// Category slots that are actually brand/series artifacts, not real
// categories — these fall through to the keyword classifier below.
const BRAND_ARTIFACT_CATEGORIES = new Set([
  "Impulse",
  "Spirit Fitness",
  "Bodysolid",
  "REP Fitness",
  "Afton",
  "Afton Longevity",
  "Impulse_VX95 Series",
  "Impulse_IF93 Series",
  "Impulse LCS Series",
  "Impulse-SL series",
  "Impulse_HSP Series",
  "Impulse_Plamax",
  "Impulse_IT95 series",
  "ITF8 Series",
  "EXER GYM Series",
  "Smart Strength by Spirit i-Strength",
  "Eleiko: World-Class Strength Equipment for Champions",
  "Beyond Power Smart Resistance Training",
]);

const KEYWORD_RULES = [
  [/treadmill/i, "Cardio", "Treadmills"],
  [/elliptical|cross trainer/i, "Cardio", "Elliptical Trainers"],
  [/(exercise|spin|upright|recumbent)\s*bike|cycle/i, "Cardio", "Exercise Bikes"],
  [/row(er|ing)/i, "Cardio", "Rowing Machines"],
  [/climber|stair\s*mill|stepper/i, "Cardio", "Steppers & Climbers"],
  [/inversion/i, "Rehab & Wellness", "Inversion Tables"],
  [/\bbmi\b|body composition/i, "Rehab & Wellness", "Body Composition"],
  [/pilates|reformer|cadillac|tower/i, "Rehab & Wellness", "Pilates Equipment"],
  [/rehab|acl|stroke|physio/i, "Rehab & Wellness", "Rehab Equipment"],
  [/flooring|rubber tile|gym mat/i, "Flooring & Storage", null],
  [/hyrox|prowler|sled|battle rope|plyo/i, "Functional Training", "Hyrox & Conditioning"],
  [/cable|functional trainer|smith machine/i, "Functional Training", "Cable Machines"],
  [/rack|squat stand|cage/i, "Strength Training", "Racks, Stands & Cages"],
  [/barbell/i, "Free Weights", "Barbells"],
  [/(bumper|competition|fleck|steel)\s*plate|kettlebell|dumbbell/i, "Free Weights", "Plates & Kettlebells"],
  [/bench/i, "Strength Training", "Benches"],
  [/selectorised|leg press|pec deck|lat pulldown|chest press|shoulder press|leg extension|leg curl/i, "Strength Training", "Selectorised Machines"],
  [/multi.?gym|home gym/i, "Home Fitness", "Multi Gyms"],
  [/foam roller|push.?up bar|resistance band|yoga mat|jump rope|ab wheel/i, "Accessories & Service", null],
  [/curl|hyperextension|roman chair|preacher|kick\s*back|pec fly|rear delt|abductor|adductor|\bdip\b|\bchin\b|calf raise|knee raise|ab\/back|plate tree|plate storage|\bstretch\b|abdominal|hack squat|low row|incline row|\brow\b|arm extension/i, "Strength Training", "Single-Station Machines"],
];

function classifyCategory(product) {
  const raw = product.category ? product.category.trim() : null;
  const rawSub = product.subcategory ? product.subcategory.trim() : null;

  if (raw && REAL_CATEGORY_MAP[raw]) {
    const [topCategory, subcategory] = REAL_CATEGORY_MAP[raw];
    return { topCategory, subcategory: subcategory ?? rawSub, source: "source" };
  }

  // Real category, not in the explicit map but not a known brand artifact
  // either (rare tail categories) — keep as-is.
  if (raw && !BRAND_ARTIFACT_CATEGORIES.has(raw)) {
    return { topCategory: raw, subcategory: rawSub, source: "source" };
  }

  // Brand-artifact or missing category: fall back to keyword classification
  // against product name + breadcrumb.
  const haystack = [product.product_name, ...(product.breadcrumb || [])].join(
    " ",
  );
  for (const [re, topCategory, subcategory] of KEYWORD_RULES) {
    if (re.test(haystack)) {
      return { topCategory, subcategory: subcategory ?? rawSub, source: "inferred" };
    }
  }

  // Nothing matched — default bucket, flagged in the QA report for review.
  return { topCategory: "Strength Training", subcategory: rawSub, source: "inferred-default" };
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

function main() {
  const raw = JSON.parse(fs.readFileSync(SOURCE_PRODUCTS_JSON, "utf8"));
  console.log(`Loaded ${raw.length} raw entries from source products.json`);

  const excludedLocations = [];
  const candidateProducts = [];

  for (const p of raw) {
    if (isDealerPage(p)) {
      excludedLocations.push(p);
      continue;
    }
    candidateProducts.push(p);
  }
  console.log(
    `Excluded ${excludedLocations.length} dealer/store-locator pages -> src/data/locations.json`,
  );
  console.log(`${candidateProducts.length} candidate real products remain`);

  // --- Duplicate product-name dedupe -------------------------------------
  const byNameKey = new Map();
  for (const p of candidateProducts) {
    const key = p.product_name.trim().toLowerCase();
    if (!byNameKey.has(key)) byNameKey.set(key, []);
    byNameKey.get(key).push(p);
  }

  function completenessScore(p) {
    let score = 0;
    if (p.description_status === "ok") score += 2;
    if (p.specifications_status === "ok") score += 2;
    score += p.image_count || 0;
    return score;
  }

  const redirects = {}; // droppedSlug -> canonicalSlug
  const keptProducts = [];
  let duplicateGroupCount = 0;

  for (const [, group] of byNameKey) {
    if (group.length === 1) {
      keptProducts.push(group[0]);
      continue;
    }
    duplicateGroupCount += 1;
    const sorted = [...group].sort(
      (a, b) => completenessScore(b) - completenessScore(a),
    );
    const canonical = sorted[0];
    keptProducts.push(canonical);
    for (const dropped of sorted.slice(1)) {
      redirects[dropped.slug] = canonical.slug;
    }
  }
  console.log(
    `Resolved ${duplicateGroupCount} duplicate product-name groups (kept most complete entry, recorded redirects for the rest)`,
  );

  // --- Normalize + classify + copy images ---------------------------------
  const qaFlags = {
    lowResolutionOnly: [],
    duplicateImageGroups: [],
    noImages: [],
    unclassified: [],
  };

  const imageHashGroups = new Map(); // sha256(file bytes) -> [{slug, fileName}], same method as reports/quality-control.json

  fs.mkdirSync(OUT_DATA_DIR, { recursive: true });
  fs.rmSync(OUT_PUBLIC_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_PUBLIC_DIR, { recursive: true });

  const cleanedProducts = keptProducts.map((p) => {
    const brand = canonicalBrand(p.brand);
    const { topCategory, subcategory, source } = classifyCategory(p);

    if (source === "inferred-default") {
      qaFlags.unclassified.push({ slug: p.slug, product_name: p.product_name });
    }

    const slugDir = path.join(OUT_PUBLIC_DIR, p.slug);
    fs.mkdirSync(slugDir, { recursive: true });

    const localImages = (p.local_images || []).map((img) => {
      const destPath = path.join(slugDir, img.fileName);
      try {
        fs.copyFileSync(img.localPath, destPath);
        const hash = crypto
          .createHash("sha256")
          .update(fs.readFileSync(destPath))
          .digest("hex");
        if (!imageHashGroups.has(hash)) imageHashGroups.set(hash, []);
        imageHashGroups.get(hash).push({ slug: p.slug, fileName: img.fileName });
      } catch {
        // Source file missing/unreadable — leave unset, page layer handles it.
      }
      return {
        fileName: img.fileName,
        localPath: `/products/${p.slug}/${img.fileName}`,
        width: img.width,
        height: img.height,
        fileSizeBytes: img.fileSizeBytes,
        sourceUrl: img.sourceUrl,
        lowResolutionFallback: Boolean(img.lowResolutionFallback),
      };
    });

    if (localImages.length === 0) {
      qaFlags.noImages.push({ slug: p.slug, product_name: p.product_name });
    } else if (localImages.every((i) => i.lowResolutionFallback)) {
      qaFlags.lowResolutionOnly.push({ slug: p.slug, product_name: p.product_name });
    }

    return {
      product_name: p.product_name,
      slug: p.slug,
      brand,
      brandSlug: brand ? slugify(brand) : null,
      category: topCategory,
      categorySlug: slugify(topCategory),
      subcategory,
      subcategorySlug: subcategory ? slugify(subcategory) : null,
      rawCategory: p.category,
      rawSubcategory: p.subcategory,
      categorySource: source,
      product_url: p.product_url,
      breadcrumb: p.breadcrumb || [],
      page_title: p.page_title,
      meta_description: p.meta_description,
      description_text: p.description_text,
      description_html: p.description_html,
      features: p.features || [],
      specifications: p.specifications || [],
      ideal_for: p.ideal_for || [],
      variants: p.variants || [],
      pdf_links: p.pdf_links || [],
      local_images: localImages,
      image_count: localImages.length,
      scrape_status: p.scrape_status,
      missing_fields: p.missing_fields || [],
      description_status: p.description_status,
      specifications_status: p.specifications_status,
    };
  });

  for (const [hash, occurrences] of imageHashGroups) {
    if (occurrences.length > 1) {
      qaFlags.duplicateImageGroups.push({ hash: hash.slice(0, 16), occurrences });
    }
  }

  cleanedProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));

  fs.writeFileSync(
    path.join(OUT_DATA_DIR, "products.json"),
    JSON.stringify(cleanedProducts, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT_DATA_DIR, "redirects.json"),
    JSON.stringify(redirects, null, 2),
  );
  fs.writeFileSync(
    path.join(OUT_DATA_DIR, "locations.json"),
    JSON.stringify(
      excludedLocations.map((l) => ({
        product_name: l.product_name,
        slug: l.slug,
        product_url: l.product_url,
      })),
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(OUT_DATA_DIR, "qa-report.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totals: {
          sourceEntries: raw.length,
          excludedLocationPages: excludedLocations.length,
          duplicateNameGroupsResolved: duplicateGroupCount,
          finalProductCount: cleanedProducts.length,
        },
        ...qaFlags,
      },
      null,
      2,
    ),
  );

  console.log(`\nWrote ${cleanedProducts.length} clean products.`);
  console.log(`QA flags: ${qaFlags.noImages.length} no-image, ${qaFlags.lowResolutionOnly.length} low-res-only, ${qaFlags.duplicateImageGroups.length} duplicate-image groups, ${qaFlags.unclassified.length} unclassified.`);
  console.log("Done.");
}

main();
