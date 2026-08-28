import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // api-server runs on port 8080 on the VPS (confirmed via ss -tlnp)
    const apiTarget = process.env.API_SERVER_URL || "http://127.0.0.1:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
