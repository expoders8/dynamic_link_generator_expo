/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/s/:shortId",
        destination: "/api/s/:shortId",
      },
    ];
  },
};

export default nextConfig;
