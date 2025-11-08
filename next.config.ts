import type { NextConfig } from "next";

const nextConfig: NextConfig = {

   reactStrictMode: true,
  // swcMinify: true,
  
  // Enable static exports for better performance
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: [],
    unoptimized: false,
  },
  /* config options here */
  reactCompiler: true,

   // Service worker configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Headers for PWA
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },


};

export default nextConfig;
