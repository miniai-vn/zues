import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpackDevMiddleware: (config: { watchOptions: {  poll: number; aggregateTimeout: number; }; }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config;
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = {
        client: {
          overlay: false,
        },
      }
    }
    return config;
  },
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
