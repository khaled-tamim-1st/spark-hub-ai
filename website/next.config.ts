import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/features",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/assistant",
        destination: "/digital-products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

