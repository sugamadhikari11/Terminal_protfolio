import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // R3F / three ecosystem packages need transpilation under Next App Router
  transpilePackages: ["three"],
};

export default nextConfig;
