import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EnquiryProvider } from "@/lib/enquiry/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnquiryDrawer } from "@/components/enquiry/EnquiryDrawer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Loader } from "@/components/motion/Loader";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { PageTransition } from "@/components/motion/PageTransition";
import { organizationSchema, SITE_URL } from "@/lib/seo/schema";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["600"],
});

const DESCRIPTION =
  "Premium fitness equipment for home gyms, commercial gyms, hotels, corporate wellness, rehabilitation, sports performance, and Pilates studios across India. Multi-brand catalogue with expert consultation since 1988.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Afton Fitness — Premium Fitness Equipment for Every Training Space",
    template: "%s | Afton Fitness",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Afton Fitness",
    locale: "en_IN",
    url: SITE_URL,
    title: "Afton Fitness — Premium Fitness Equipment for Every Training Space",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Afton Fitness — Premium Fitness Equipment",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <MotionRoot>
          <EnquiryProvider>
            <Loader />
            <Header />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <FloatingActions />
            <MobileActionBar />
            <EnquiryDrawer />
          </EnquiryProvider>
        </MotionRoot>
      </body>
    </html>
  );
}
