import { Check } from "lucide-react";

export function FeatureList({ features }: { features: string[] }) {
  if (features.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      {features.map((feature, index) => (
        <div key={index} className="flex gap-4">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <p className="font-body text-base text-on-surface-variant">{feature}</p>
        </div>
      ))}
    </div>
  );
}
