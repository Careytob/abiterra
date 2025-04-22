/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'szeqlqhzewvrdeerdamx.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
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
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.abiterra.com',
          },
        ],
        destination: 'https://abiterra.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;