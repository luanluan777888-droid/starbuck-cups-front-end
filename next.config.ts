import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import path from "path";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    // Disable Next.js built-in image optimization (for non-Vercel deployments)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hasron-starbucks-shop.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "starbucks-shop.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 300, 384, 512],
    qualities: [75, 80, 85, 90, 95, 100],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Bundle optimization
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-loading-skeleton",
      "@lexical/react",
      "@lexical/html",
      "@lexical/utils",
      "lodash",
      "swiper",
    ],
    webpackBuildWorker: true,
  },
  // Compression
  compress: true,
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
    "@lexical/react": {
      transform: "@lexical/react/{{member}}",
    },
  },
  webpack: (config, { isServer, webpack }) => {
    // Aggressive modern-only build mode:
    // Strip Next legacy polyfill bundle from client runtime.
    // Trade-off: very old browsers are no longer supported.
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "next/dist/build/polyfills/polyfill-module": path.resolve(
          __dirname,
          "src/polyfills/polyfill-module-empty.js"
        ),
        "next/dist/build/polyfills/polyfill-module.js": path.resolve(
          __dirname,
          "src/polyfills/polyfill-module-empty.js"
        ),
        "next/dist/build/polyfills/process": path.resolve(
          __dirname,
          "src/polyfills/process-empty.js"
        ),
        "next/dist/build/polyfills/process.js": path.resolve(
          __dirname,
          "src/polyfills/process-empty.js"
        ),
      };

      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /polyfills[\\/]polyfill-module(?:\.js)?$/,
          (resource: { request: string }) => {
            resource.request = path.resolve(
              __dirname,
              "src/polyfills/polyfill-module-empty.js"
            );
          }
        ),
        new webpack.NormalModuleReplacementPlugin(
          /polyfills[\\/]process(?:\.js)?$/,
          (resource: { request: string }) => {
            resource.request = path.resolve(
              __dirname,
              "src/polyfills/process-empty.js"
            );
          }
        )
      );
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);

