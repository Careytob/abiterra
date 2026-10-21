/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      }
    ],
    unoptimized: true, // This will bypass Next.js image optimization for all images
    minimumCacheTTL: 3600,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=3600',
          },
        ],
      },
      {
        source: '/sitemap:path*', // Handles dynamic sitemaps if you have them
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ];
  },
  // Optional: redirect www.<host> -> <host>. Set CANONICAL_HOST (e.g. "example.com")
  // in your env to enable it. Nothing is redirected when it is unset.
  async redirects() {
    const canonicalHost = process.env.CANONICAL_HOST?.trim();
    if (!canonicalHost) return [];
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${canonicalHost}` }],
        destination: `https://${canonicalHost}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;