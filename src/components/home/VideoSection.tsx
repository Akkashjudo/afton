"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site-config";

const VIDEO_ID = "J7ixJs7KibY";

/**
 * Lazy YouTube facade: renders only the poster image until the user clicks,
 * then swaps in the iframe. Avoids loading YouTube's player JS (~1MB+) on
 * first paint, and never autoplays with sound unprompted.
 */
export function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-gap bg-surface-low">
      <div className="container-afton">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="t-label mb-4 block text-accent">In Action</span>
            <h2 className="t-headline-lg text-primary">See Afton Equipment in Action</h2>
            <p className="t-body-lg mt-5 max-w-md text-on-surface-variant">
              Explore equipment demonstrations, product highlights, and training
              solutions from Afton Fitness.
            </p>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex min-h-[44px] items-center gap-2 border-b border-primary pb-1 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Visit the Afton YouTube Channel
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </a>
          </Reveal>

          <Reveal className="flex justify-center lg:justify-end">
            {/* 9:16 Shorts ratio, capped so it never dominates the page */}
            <div className="relative aspect-[9/16] w-full max-w-[300px] overflow-hidden border border-outline-variant bg-black">
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&playsinline=1`}
                  title="Afton Fitness equipment in action"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play Afton Fitness video"
                  className="group absolute inset-0 h-full w-full"
                >
                  <Image
                    src={`https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`}
                    alt=""
                    fill
                    sizes="300px"
                    unoptimized
                    className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-6 w-6 fill-primary text-primary" aria-hidden />
                    </span>
                  </span>
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
