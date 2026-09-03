/**
 * File: apps/web/next.config.js
 * Yegna AI - Next.js Configuration
 * 
 * Configures Next.js for the Yegna AI frontend application.
 */

const nextConfig = {
  reactStrictMode: true,
  
  // Enable transpilation of workspace packages
  transpilePackages: [
    '@yegna/config',
    '@yegna/ui',
    '@yegna/utils',
    '@yegna/i18n'
  ],
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  },
  
  // Image optimization configuration
  images: {
    domains: [
      'res.cloudinary.com'
    ]
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;