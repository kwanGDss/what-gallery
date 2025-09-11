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
