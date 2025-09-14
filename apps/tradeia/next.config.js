/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: false, // Disable gzip compression globally
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Accept-Encoding',
            value: 'identity',
          },
          {
            key: 'Content-Encoding',
            value: 'identity',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;