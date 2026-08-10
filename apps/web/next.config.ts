import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  transpilePackages: ["@a-topic/shared"],
};

export default nextConfig;
