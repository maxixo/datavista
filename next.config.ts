import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
   turbopack: {
    root: path.resolve(__dirname), // e.g. C:\Users\HP\Documents\HNG\datavista

   },
   reactStrictMode: true,
  
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
