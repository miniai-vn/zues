import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Adjust size as needed
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
