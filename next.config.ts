import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"

      }
    ]
  },
  eslint:{
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
