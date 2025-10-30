import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google.com *.gstatic.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: blob: *.imagekit.io *.googleusercontent.com *.google.com images.pexels.com; font-src 'self' fonts.googleapis.com fonts.gstatic.com; connect-src 'self' *.google-analytics.com *.googletagmanager.com *.supabase.com *.supabase.co *.imagekit.io upload.imagekit.io; media-src 'self' *.imagekit.io; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;`.replace(/\s{2,}/g, ' ').trim()
  }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  staticPageGenerationTimeout: 120,
  productionBrowserSourceMaps: false,
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [16, 32, 64, 96, 256],
    dangerouslyAllowSVG: false,
  },

  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      { 
        source: '/api/auth/(.*)', 
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Cookie' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ] 
      },
      { 
        source: '/api/(.*)', 
        headers: [
          ...securityHeaders, 
          { key: 'Cache-Control', value: 'no-store' }
        ] 
      },
      { 
        source: '/_next/static/(.*)', 
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] 
      },
      { 
        source: '/robots.txt', 
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] 
      },
      { 
        source: '/rss.xml', 
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' }, 
          { key: 'Content-Type', value: 'application/rss+xml' }
        ] 
      },
    ];
  },

  async redirects() {
    return [];
  },

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
