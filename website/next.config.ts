import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_SERVER_URL 
          ? `${process.env.API_SERVER_URL}/api/:path*` 
          : "http://127.0.0.1:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
