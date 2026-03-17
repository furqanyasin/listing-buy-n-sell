import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Transpile shared packages from the monorepo
  transpilePackages: ['@pw-clone/ui', '@pw-clone/types'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },

  // Strict mode for catching bugs early
  reactStrictMode: true,

  // Experimental features
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
