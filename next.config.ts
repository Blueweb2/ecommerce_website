import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    workerThreads: true,
  },
  async redirects() {
    return [
      {
        source: "/placeholder.png",
        destination: "/images/placeholder.svg",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
