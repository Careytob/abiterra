/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'szeqlqhzewvrdeerdamx.supabase.co',
        pathname: '/storage/v1/object/**',
      }
    ],
    minimumCacheTTL: 3600, // Cache optimized images for at least 1 hour
  }
};

module.exports = nextConfig;