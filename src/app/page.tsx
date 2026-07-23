import { getBrands, getCategories } from "@/lib/products";
import { pickHeroProduct, pickCategoryImage, pickFeatured } from "@/lib/products/featured";
import { Hero } from "@/components/home/Hero";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { CategoryBento, type BentoCategory } from "@/components/home/CategoryBento";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { CommercialSolutions } from "@/components/home/CommercialSolutions";
import { VideoSection } from "@/components/home/VideoSection";
import { CatalogueSection } from "@/components/home/CatalogueSection";

/** Category slots for the homepage bento, in the approved layout order. */
const BENTO_SLOTS = ["cardio", "strength-training", "rehab-wellness", "home-fitness"];

export default function HomePage() {
  const categories = getCategories();
  const brands = getBrands();

  const heroProduct = pickHeroProduct();

  const bento: BentoCategory[] = BENTO_SLOTS.map((slug, i) => {
    const cat = categories.find((c) => c.slug === slug);
    return {
      index: String(i + 1).padStart(2, "0"),
      name: cat?.name ?? slug,
      slug,
      count: cat?.count ?? 0,
      image: pickCategoryImage(slug)?.local_images[0],
    };
  }).filter((b) => b.count > 0);

  const featured = pickFeatured(2, heroProduct ? [heroProduct.slug] : []);

  return (
    <>
      <Hero heroProduct={heroProduct} />
      <BrandMarquee brands={brands} />
      <CategoryBento categories={bento} />
      <FeaturedEquipment products={featured} />
      <CommercialSolutions />
      <VideoSection />
      <CatalogueSection />
    </>
  );
}
