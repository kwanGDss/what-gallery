import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations

  // Image optimization (disabled for static export)
  images: {
    unoptimized: true,
  },

  // Bundle analyzer (development only)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enable bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      )
    }

    // Optimize lodash imports
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^lodash$/, 'lodash-es')
    )

    // Tree shaking optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
            priority: 10,
          },
          posts: {
            test: /[\\/]components[\\/]posts[\\/]/,
            name: 'post-components',
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }

    return config
  },

  // Output configuration for performance
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/what-gallery' : '',

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable compression
  compress: true,

  // PWA and caching headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects and rewrites for performance
  redirects: async () => {
    return []
  },

  // Enable edge runtime for API routes when possible
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // External packages for server components
  serverExternalPackages: ['@node-rs/argon2'],
  
  // Turbopack configuration
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
