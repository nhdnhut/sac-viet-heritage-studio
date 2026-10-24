import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  serverExternalPackages: ["node:sqlite"],
  // Allow local assets and inline base64 images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
