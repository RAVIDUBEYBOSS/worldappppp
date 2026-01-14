import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedDevOrigins: ["unejected-niobous-cheyenne.ngrok-free.dev"], 
    },
  },
};

export default nextConfig;