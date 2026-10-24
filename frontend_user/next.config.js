const backendTarget =
  process.env.INTERNAL_BACKEND_URL ||
  (process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v1\/?$/, '')
    : null) ||
  'http://127.0.0.1:30014';

const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendTarget}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
