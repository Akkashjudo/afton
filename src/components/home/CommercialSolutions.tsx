import Link from "next/link";
import { ArrowRight, Building2, Building, Hotel } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const SOLUTIONS = [
  {
    icon: Building2,
    title: "Corporate Wellness",
    body: "Boost employee performance and retention with state-of-the-art on-site fitness facilities designed for the modern workplace.",
  },
  {
    icon: Building,
    title: "Luxury Real Estate",
    body: "Elevate your property value with boutique gym designs that reflect the premium nature of your residential development.",
  },
  {
    icon: Hotel,
    title: "Hospitality & Resorts",
    body: "Provide your guests with an unparalleled workout experience using the same equipment found in the world's top fitness clubs.",
  },
];

export function CommercialSolutions() {
  return (
    <section className="section-gap bg-primary text-on-primary">
      <div className="container-afton">
        <Reveal className="mb-16 max-w-3xl">
          <span className="t-label mb-4 block text-on-dark-muted">Tailored for Excellence</span>
          <h2 className="t-headline-lg text-on-primary">
            Commercial Solutions for Elite Facilities
          </h2>
          <p className="t-body-lg mt-6 text-on-dark-muted">
            From initial floor planning to lifetime maintenance, we partner with the
            most prestigious fitness destinations in India.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {SOLUTIONS.map(({ icon: Icon, title, body }) => (
            <StaggerItem key={title}>
              <div className="group flex h-full flex-col border border-white/15 p-10 transition-colors hover:bg-white/5">
                <Icon className="mb-8 h-12 w-12 text-accent" aria-hidden />
                <h3 className="t-headline-md mb-4 text-on-primary">{title}</h3>
                <p className="mb-12 text-on-dark-muted">{body}</p>
                <Link
                  href="/commercial-solutions"
                  className="t-label mt-auto flex items-center gap-2 text-on-primary transition-all group-hover:gap-4"
                >
                  Learn More <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
