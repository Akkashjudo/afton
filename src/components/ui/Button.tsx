import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Sharp industrial buttons (0 radius). Primary = black → Performance Red on
 * hover. All CTA labels use the technical mono label style (uppercase, tracked).
 */
export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-accent",
        secondary:
          "border border-primary text-primary bg-transparent hover:bg-primary hover:text-on-primary",
        outline:
          "border border-outline-variant text-primary bg-transparent hover:bg-surface-high",
        whatsapp: "bg-whatsapp text-white hover:brightness-95",
        ghost: "text-primary hover:text-accent",
      },
      size: {
        default: "px-8 py-4",
        sm: "px-6 py-3",
        lg: "px-10 py-5",
        block: "w-full py-4",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    loading?: boolean;
    icon?: ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  loading,
  disabled,
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
