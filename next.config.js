/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/admin.html',
        destination: '/admin',
      },
    ];
  },
}

module.exports = nextConfig
