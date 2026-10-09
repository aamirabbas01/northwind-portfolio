import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL?.replace(/\/+$/, "") || "http://northwindnode.runasp.net/";

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
