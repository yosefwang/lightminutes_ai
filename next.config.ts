import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production deployment
  output: 'standalone',
};

export default nextConfig;
