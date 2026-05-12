/** @type {import('next').NextConfig} */

// The actual backend server URL (Express app deployed separately)
// Set BACKEND_URL in Vercel Dashboard → Frontend Project → Environment Variables
const BACKEND_URL = process.env.BACKEND_URL || 'https://porta-v2-backend.onrender.com';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Proxy all /api/* requests from the frontend to the actual Express backend
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
