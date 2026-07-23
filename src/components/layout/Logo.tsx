import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Official Afton Fitness Equipment wordmark.
 *
 * Source artwork is 480×169 with transparency. It is rendered at its true
 * aspect ratio (never stretched or cropped) and sized by height only, so the
 * width follows automatically. next/image re-encodes to modern formats per
 * browser, so it stays sharp on high-DPI screens without shipping a large file.
 *
 * The mark is black, so on dark surfaces it sits inside a white padded plate
 * rather than being recoloured or inverted.
 */
const LOGO_SRC = "/brand/afton-logo.png";
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 169;

export function Logo({
  className,
  onDark = false,
  priority = false,
  /** Height utility classes — tune per placement (header vs footer vs drawer). */
  sizeClass = "h-8 w-auto md:h-9",
}: {
  className?: string;
  onDark?: boolean;
  priority?: boolean;
  sizeClass?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Afton Fitness Equipment — home"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <span className={cn(onDark && "inline-flex bg-white px-3 py-2")}>
        <Image
          src={LOGO_SRC}
          alt="Afton Fitness Equipment"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority={priority}
          className={sizeClass}
        />
      </span>
    </Link>
  );
}
