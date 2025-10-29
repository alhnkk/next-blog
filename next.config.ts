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
  
  // ✅ OPTIMIZED: Enable streaming for faster FCP
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // ISR caching configuration handled by Next.js automatically
  },
  
  // Enable ISR (Incremental Static Regeneration) for better performance
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 60 seconds - extended TTL
    pagesBufferLength: 10, // Buffer 10 pages for faster navigation
  },
  
  // Optimize dynamic imports
  staticPageGenerationTimeout: 60,
  
  // ✅ OPTIMIZED: CSS and JavaScript minification
  swcMinify: true,
  productionBrowserSourceMaps: false,
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    // Optimize device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable AVIF support first
    dangerouslyAllowSVG: false,
  },

  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // ✅ OPTIMIZED: Auth API headers - allow credentials and proper CORS
      { 
        source: '/api/auth/(.*)', 
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Cookie' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        ] 
      },
      { 
        source: '/api/(.*)', 
        headers: [
          ...securityHeaders, 
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
        ] 
      },
      { 
        source: '/api/auth/session', 
        headers: [
          { key: 'Cache-Control', value: 'private, max-age=300' },
          { key: 'Vary', value: 'Cookie' }
        ] 
      },
      { 
        source: '/_next/static/(.*)', 
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] 
      },
      { 
        source: '/public/(.*)', 
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
      // ✅ OPTIMIZED: Ana sayfa için aggressive ISR caching
      { 
        source: '/', 
        headers: [
          // 10 minutes local cache, 1 hour CDN cache, 7 days stale fallback
          { key: 'Cache-Control', value: 'public, max-age=600, s-maxage=3600, stale-while-revalidate=604800' }
        ] 
      },
      // ✅ OPTIMIZED: Blog post sayfaları için aggressive caching
      { 
        source: '/blog/:slug', 
        headers: [
          // 1 hour for immediate revalidation
          // 86400 seconds (1 day) for CDN cache
          // stale-while-revalidate for serving stale content
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' }
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
