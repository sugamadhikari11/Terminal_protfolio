import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Canonical URLs have no trailing slash (/about not /about/) — Next 308s the slash form
  trailingSlash: false,
  // R3F / three ecosystem packages need transpilation under Next App Router
  transpilePackages: ["three"],
};

export default nextConfig;
