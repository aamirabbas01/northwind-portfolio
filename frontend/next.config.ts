import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");

if (!backendUrl) {
  throw new Error("BACKEND_URL must be set to the backend origin.");
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
