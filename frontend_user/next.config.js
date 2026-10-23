/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: (process.env.INTERNAL_BACKEND_URL || 'http://127.0.0.1:30014') + '/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
