import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No rewrites here — the app/api/[...path]/route.ts smart proxy handles all /api/* requests
  // It tries ports 8080 → 3000 → 5000 in order, skipping HTML error responses
};

export default nextConfig;
