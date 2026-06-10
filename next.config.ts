import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS ? "/fileconvert" : "";

const nextConfig: NextConfig = {
  output: "export",
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  basePath,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ]
  },
};

export default nextConfig;
