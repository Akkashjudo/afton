import type { Metadata } from "next";
import { EnquiryPageContent } from "@/components/enquiry/EnquiryPageContent";

export const metadata: Metadata = {
  title: "Your Enquiry",
  description: "Review your selected equipment and request a quotation from Afton Fitness.",
};

export default function EnquiryPage() {
  return <EnquiryPageContent />;
}
