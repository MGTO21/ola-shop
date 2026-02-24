/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ola-shop.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ola-shop.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:9000/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://127.0.0.1:9000/auth/:path*',
      },
      {
        source: '/store/:path*',
        destination: 'http://127.0.0.1:9000/store/:path*',
      },
      {
        source: '/admin/:path*',
        destination: 'http://127.0.0.1:9000/admin/:path*',
      },
    ]
  },
}

module.exports = nextConfig
