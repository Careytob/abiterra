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
    minimumCacheTTL: 3600, // Cache optimized images for at least 1 hour
  },
  typescript: {
    ignoreBuildErrors: true, // Bypass TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Optional, since you're using --no-lint
  },
};

export default nextConfig; // Use ES module export instead of CommonJS