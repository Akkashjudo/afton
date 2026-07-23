import type { NextConfig } from "next";
import redirectMap from "./src/data/redirects.json";

const nextConfig: NextConfig = {
  images: {
    // YouTube poster frames for the lazy video facade.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    return Object.entries(redirectMap).map(([oldSlug, canonicalSlug]) => ({
      source: `/product/${oldSlug}`,
      destination: `/product/${canonicalSlug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
