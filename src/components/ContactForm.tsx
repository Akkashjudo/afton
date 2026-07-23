"use client";

import { useForm } from "react-hook-form";
import { siteConfig } from "@/lib/site-config";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  department: string;
  message: string;
};

const INPUT =
  "w-full border border-outline-variant bg-transparent p-3 font-body text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";
const LABEL = "mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.1em]";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { department: "General enquiry" } });

  function onSubmit(values: FormValues) {
    const subject = encodeURIComponent(`${values.department} — ${values.name}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nPhone: ${values.phone}\nEmail: ${values.email}\n\n${values.message}`,
    );
    window.location.assign(`mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className={LABEL}>Full Name</label>
        <input id="contact-name" className={INPUT} {...register("name", { required: "Name is required" })} />
        {errors.name && <p role="alert" className="mt-1 font-mono text-[10px] uppercase text-error">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className={LABEL}>Email</label>
          <input id="contact-email" type="email" className={INPUT} {...register("email", { required: "Required" })} />
          {errors.email && <p role="alert" className="mt-1 font-mono text-[10px] uppercase text-error">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="contact-phone" className={LABEL}>Phone</label>
          <input id="contact-phone" type="tel" className={INPUT} {...register("phone")} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-department" className={LABEL}>Enquiry Type</label>
        <select id="contact-department" className={INPUT} {...register("department")}>
          <option>General enquiry</option>
          <option>Product availability</option>
          <option>Commercial gym project</option>
          <option>Service / warranty support</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL}>Message</label>
        <textarea
          id="contact-message"
          rows={4}
          className={`${INPUT} resize-none`}
          {...register("message", { required: "Please add a short message" })}
        />
        {errors.message && <p role="alert" className="mt-1 font-mono text-[10px] uppercase text-error">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-primary py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-primary transition-colors hover:bg-accent"
      >
        Send Message
      </button>
    </form>
  );
}
