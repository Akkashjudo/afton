"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { LocalImage } from "@/types/product";
import { buildAltText } from "@/lib/images";
import { cn } from "@/lib/utils/cn";

/**
 * Product gallery — large hover-zoom frame + thumbnail strip, matching the
 * Stitch product page. Sharp corners, hairline borders, active-thumb outline.
 */
export function ProductGallery({
  productName,
  images,
}: {
  productName: string;
  images: LocalImage[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center border border-outline-variant bg-surface-low font-mono text-xs uppercase tracking-wider text-on-surface-variant">
        Product imagery being updated
      </div>
    );
  }

  const active = images[activeIndex];

  function onMove(e: React.MouseEvent) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={frameRef}
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-outline-variant bg-surface-low p-8"
        style={{ cursor: zoom ? "crosshair" : "default" }}
      >
        <Image
          key={active.fileName}
          src={active.localPath}
          alt={buildAltText(productName, activeIndex)}
          width={active.width}
          height={active.height}
          priority
          sizes="(min-width: 1024px) 55vw, 90vw"
          className="h-full w-full object-contain transition-transform duration-300 ease-out"
          style={
            zoom
              ? { transform: "scale(2.2)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
              : undefined
          }
        />
        <div className="pointer-events-none absolute bottom-4 right-4 bg-surface/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          Hover to Zoom
        </div>
      </div>

      {images.length > 1 && (
        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2" role="tablist" aria-label="Product images">
          {images.map((img, index) => (
            <button
              key={img.fileName}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex h-24 w-24 flex-shrink-0 items-center justify-center border bg-surface-low p-2 transition-colors",
                index === activeIndex ? "border-2 border-primary" : "border-outline-variant hover:border-primary",
              )}
            >
              <Image
                src={img.localPath}
                alt=""
                width={img.width}
                height={img.height}
                sizes="96px"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
