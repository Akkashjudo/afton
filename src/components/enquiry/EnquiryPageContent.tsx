"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Minus, Plus } from "lucide-react";
import { useEnquiry } from "@/lib/enquiry/context";
import { buildWhatsAppMessage } from "@/lib/enquiry/whatsapp";
import { buildWhatsAppLink, siteConfig } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  message: string;
};

export function EnquiryPageContent() {
  const { items, removeItem, updateQuantity } = useEnquiry();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  function onSubmit(values: FormValues) {
    const message = buildWhatsAppMessage(items, {
      usage: values.company,
      location: values.city,
      name: values.name,
      phone: values.phone,
    });
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  if (items.length === 0) {
    return (
      <div className="container-afton pt-32 pb-24 text-center">
        <span className="t-label mb-4 block text-on-surface-variant tracking-[0.2em]">
          01 / Selection Summary
        </span>
        <h1 className="t-display mb-6 text-primary">Enquiry List</h1>
        <p className="mx-auto mb-8 max-w-md t-body-lg text-on-surface-variant">
          Your enquiry list is empty. Browse the catalogue and add the equipment
          you&apos;d like a professional quotation for.
        </p>
        <Link
          href="/products"
          className="inline-flex bg-primary px-10 py-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-afton pt-32 pb-24">
      <header className="mb-16">
        <span className="t-label mb-4 block text-on-surface-variant tracking-[0.2em]">
          01 / Selection Summary
        </span>
        <h1 className="t-display mb-6 text-primary">Enquiry List</h1>
        <p className="max-w-2xl t-body-lg text-on-surface-variant">
          Review your selected equipment. Adjust quantities before submitting for a
          professional quotation.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Tabular list */}
        <div className="space-y-12 lg:col-span-8">
          <div>
            <div className="grid grid-cols-12 border-b border-outline-variant pb-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
              <div className="col-span-6">Equipment</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {items.map((item) => (
              <div key={item.slug} className="grid grid-cols-12 items-start border-b border-outline-variant py-8">
                <div className="col-span-12 flex gap-6 md:col-span-6">
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center border border-outline-variant bg-surface-low p-2">
                    {item.image ? (
                      <Image src={item.image} alt="" width={96} height={96} className="h-full w-full object-contain" />
                    ) : (
                      <span className="font-mono text-[9px] uppercase text-outline">No image</span>
                    )}
                  </div>
                  <div>
                    <h3 className="t-headline-md text-primary">{item.product_name}</h3>
                    {item.brand && (
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                        {item.brand}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-6 mt-4 flex justify-center md:col-span-3 md:mt-0">
                  <div className="inline-flex h-10 items-center border border-outline-variant">
                    <button
                      type="button"
                      className="flex h-full w-9 items-center justify-center hover:text-accent"
                      aria-label={`Decrease quantity for ${item.product_name}`}
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <span className="w-10 text-center font-mono text-base">{item.quantity}</span>
                    <button
                      type="button"
                      className="flex h-full w-9 items-center justify-center hover:text-accent"
                      aria-label={`Increase quantity for ${item.product_name}`}
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </div>
                <div className="col-span-6 mt-4 flex justify-end md:col-span-3 md:mt-0">
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:text-error"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-6 bg-surface-low p-8 md:flex-row">
            <div>
              <h4 className="t-headline-md mb-2 text-primary">Need an instant estimate?</h4>
              <p className="text-on-surface-variant">
                Send your enquiry list directly to our experts on WhatsApp for a priority response.
              </p>
            </div>
            <a
              href={buildWhatsAppLink(buildWhatsAppMessage(items))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-3 bg-whatsapp px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all hover:brightness-95"
            >
              <WhatsAppIcon className="h-5 w-5" /> Generate WhatsApp Quotation
            </a>
          </div>
        </div>

        {/* Contact form */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 border border-outline-variant bg-white p-8">
            <span className="t-label mb-6 block text-on-surface-variant tracking-[0.2em]">
              02 / Contact Information
            </span>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Field label="Full Name" error={errors.name?.message}>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full border border-outline-variant bg-transparent p-3 font-body"
                  placeholder="e.g. Alexander Pierce"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    {...register("email", { required: "Required" })}
                    className="w-full border border-outline-variant bg-transparent p-3 font-body"
                    placeholder="you@company.com"
                  />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input
                    type="tel"
                    {...register("phone", { required: "Required" })}
                    className="w-full border border-outline-variant bg-transparent p-3 font-body"
                    placeholder="+91 98765 43210"
                  />
                </Field>
              </div>
              <Field label="City">
                <input
                  {...register("city")}
                  className="w-full border border-outline-variant bg-transparent p-3 font-body"
                  placeholder="e.g. Chennai"
                />
              </Field>
              <Field label="Gym / Company Name">
                <input
                  {...register("company")}
                  className="w-full border border-outline-variant bg-transparent p-3 font-body"
                  placeholder="Elite Performance Center"
                />
              </Field>
              <Field label="Message (Optional)">
                <textarea
                  {...register("message")}
                  rows={3}
                  className="w-full resize-none border border-outline-variant bg-transparent p-3 font-body"
                  placeholder="Tell us about your space or specific needs…"
                />
              </Field>

              <div className="border-t border-outline-variant pt-4">
                <p className="mb-4 font-mono text-[10px] uppercase leading-relaxed tracking-wide text-on-surface-variant">
                  * Final pricing is calculated based on logistics, installation, and
                  quantity-based commercial discounts.
                </p>
                <button
                  type="submit"
                  className="w-full bg-primary py-5 font-display text-xl font-bold uppercase tracking-tight text-on-primary transition-colors hover:bg-accent"
                >
                  Submit Enquiry
                </button>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-4 block text-center font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant underline"
                >
                  Or email us directly
                </a>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.1em]">
        {label}
      </label>
      {children}
      {error && <p role="alert" className="mt-1 font-mono text-[10px] uppercase text-error">{error}</p>}
    </div>
  );
}
