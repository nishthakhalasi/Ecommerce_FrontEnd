/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
    qualities: [75, 85, 100],
  },
  experimental: {
    middlewarePrefetch: true,
  },
};

export default nextConfig;
