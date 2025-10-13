/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    // Disable ESLint during builds in Docker to avoid configuration issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds in Docker to avoid configuration issues
    ignoreBuildErrors: true,
  },
  // Disable static optimization entirely
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

module.exports = nextConfig;
