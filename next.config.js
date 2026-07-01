/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [{ source: '/admin.html', destination: '/admin' }];
  },
};
module.exports = nextConfig;
