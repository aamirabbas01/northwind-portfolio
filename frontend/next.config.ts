import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL?.replace(/\/+$/, "") || "http://127.0.0.1:3020";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;