"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, FileText } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";

type FormValues = { name: string; email: string; phone: string };

const INPUT =
  "w-full min-h-[48px] border border-white/20 bg-white/5 px-4 font-body text-base text-white placeholder:text-on-dark-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent";

/**
 * Catalogue lead capture.
 *
 * There is no backend/mailer wired up on this project, so rather than faking a
 * "check your inbox" confirmation, submitting hands the request — with the
 * details entered — straight to the sales team over WhatsApp, which genuinely
 * delivers. Swap `onSubmit` for a real API route once a backend exists.
 */
export function CatalogueSection() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  function onSubmit(values: FormValues) {
    const message = [
      "Hello Afton Fitness,",
      "",
      "Please send me the complete product catalogue.",
      "",
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
    ].join("\n");
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <section id="catalogue" className="scroll-mt-24 bg-primary py-20 text-on-primary md:py-24">
      <div className="container-afton">
        <Reveal className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="t-label mb-4 flex items-center gap-2 text-accent">
              <FileText className="h-4 w-4" aria-hidden /> Product Catalogue
            </span>
            <h2 className="t-headline-lg text-on-primary">
              Download the Complete Afton Product Catalogue
            </h2>
            <p className="t-body-lg mt-5 max-w-xl text-on-dark-muted">
              Explore Afton&apos;s complete range of cardio, strength, free-weight,
              Pilates, rehabilitation, flooring, and commercial gym equipment.
            </p>
          </div>

          <div className="border border-white/15 bg-white/[0.03] p-6 md:p-8">
            {sent ? (
              <div className="flex flex-col items-start gap-4 py-4">
                <span className="flex h-12 w-12 items-center justify-center bg-whatsapp">
                  <Check className="h-6 w-6 text-white" aria-hidden />
                </span>
                <h3 className="t-headline-md text-on-primary">Request opened in WhatsApp</h3>
                <p className="text-on-dark-muted">
                  Send the pre-filled message and our team will share the catalogue with
                  you directly. Didn&apos;t open?{" "}
                  <a
                    href={buildWhatsAppLink(
                      `Hello Afton Fitness, please send me the complete product catalogue.\n\nName: ${getValues("name")}\nEmail: ${getValues("email")}\nPhone: ${getValues("phone")}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-white"
                  >
                    Open it again
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted underline underline-offset-4 hover:text-white"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="cat-name" className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted">
                    Full Name
                  </label>
                  <input
                    id="cat-name"
                    className={INPUT}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    {...register("name", { required: "Please enter your name" })}
                  />
                  {errors.name && <p role="alert" className="mt-1 font-mono text-[10px] uppercase text-accent">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="cat-email" className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted">
                    Email Address
                  </label>
                  <input
                    id="cat-email"
                    type="email"
                    className={INPUT}
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "Please enter your email",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                  />
                  {errors.email && <p role="alert" className="mt-1 font-mono text-[10px] uppercase text-accent">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="cat-phone" className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted">
                    Phone Number
                  </label>
                  <input
                    id="cat-phone"
                    type="tel"
                    className={INPUT}
                    placeholder="+91 98765 43210"
                    aria-invalid={!!errors.phone}
                    {...register("phone", {
                      required: "Please enter your phone number",
                      minLength: { value: 8, message: "Enter a valid phone number" },
                    })}
                  />
                  {errors.phone && <p role="alert" className="mt-1 font-mono text-[10px] uppercase text-accent">{errors.phone.message}</p>}
                </div>

                <button
                  type="submit"
                  className="mt-2 flex min-h-[52px] w-full items-center justify-center bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
                >
                  Send Me the Catalogue
                </button>

                <a
                  href={buildWhatsAppLink("Hello Afton Fitness, please send me the product catalogue.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 border border-white/20 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/10"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
                </a>

                <p className="pt-1 text-center font-mono text-[10px] uppercase tracking-wide text-on-dark-muted">
                  Or email {siteConfig.contact.email}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
