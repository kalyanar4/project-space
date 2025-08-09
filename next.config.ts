import type { NextConfig } from "next";

// Next.js configuration. In addition to setting the optional base path we
// also tweak the webpack configuration so that the optional `canvas`
// dependency used by `pdfjs-dist` is stubbed out. The pdf.js library checks
// for this module when running in Node environments, but our application only
// uses it in the browser. Without this alias Next.js would fail to compile
// because it tries to bundle the native `canvas` package.
const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  webpack: (config) => {
    // Prevent webpack from attempting to bundle the native `canvas` module.
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
