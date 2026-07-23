"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import type { Product } from "@/types/product";
import { buildAltText } from "@/lib/images";
import { heroItem, heroStagger, EASE } from "@/components/motion/variants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";

const SEGMENTS = [
  "Home Gyms",
  "Commercial Gyms",
  "Hotels",
  "Corporate Wellness",
  "Rehabilitation",
  "Sports Performance",
  "Pilates Studios",
];

export function Hero({ heroProduct }: { heroProduct: Product | undefined }) {
  const image = heroProduct?.local_images[0];
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Mild float — the image drifts a little slower than the page.
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[88vh] items-center overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
    >
      {/* Equipment visual */}
      <motion.div
        style={{ y: imageY }}
        className="pointer-events-none absolute right-0 top-1/2 -z-10 flex h-full w-full -translate-y-1/2 items-center justify-center opacity-[0.12] md:pr-10 lg:w-[58%] lg:justify-end lg:opacity-100"
      >
        {image && (
          <motion.div
            className="flex h-full max-h-[620px] w-full items-center justify-center p-10"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          >
            <Image
              src={image.localPath}
              alt={buildAltText(heroProduct!.product_name, 0)}
              width={image.width}
              height={image.height}
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="container-afton relative z-10"
        variants={heroStagger}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          <motion.span
            variants={heroItem}
            className="t-label mb-6 block text-accent tracking-[0.2em]"
          >
            EST. {siteConfig.established} — INDIA&apos;S PREMIUM FITNESS PARTNER
          </motion.span>

          <motion.h1 variants={heroItem} className="t-display mb-8 text-primary">
            Premium Fitness Equipment
            <br />
            for Every Training Space.
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="t-body-lg mb-8 max-w-xl text-on-surface-variant"
          >
            Complete equipment solutions for home gyms, commercial facilities, hotels,
            corporate wellness, rehabilitation centres, sports performance training, and
            Pilates studios — across India.
          </motion.p>

          <motion.ul
            variants={heroItem}
            className="mb-10 flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Spaces we equip"
          >
            {SEGMENTS.map((segment) => (
              <li
                key={segment}
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant"
              >
                {segment}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={heroItem} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/products"
              className="group flex min-h-[52px] items-center justify-center gap-3 bg-primary px-9 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent"
            >
              Explore Equipment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <a
              href={buildWhatsAppLink(
                "Hello Afton Fitness, I'd like to enquire about equipment for my facility.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center justify-center gap-3 bg-whatsapp px-9 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
            <Link
              href="#catalogue"
              className="flex min-h-[52px] items-center justify-center gap-3 border border-primary px-9 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download Catalogue
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
