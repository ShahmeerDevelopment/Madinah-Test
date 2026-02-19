/* eslint-disable no-unused-vars */
/** @type {import('next').NextConfig} */
import { i18n } from "./next-i18next.config.mjs";

const timestamp = Date.now();

const nextConfig = {
  turbopack: {},
  // Required for PostHog proxy - prevents redirect that strips trailing slashes
  // PostHog API endpoints use trailing slashes (like /e/) which would otherwise break
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "madinah.com",
      },
      {
        protocol: "https",
        hostname: "madinah-dev.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "madinah-dev.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "madinah.s3",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "vimeocdn.com",
      },
      {
        protocol: "https",
        hostname: "vimeo.com",
      },
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
      {
        protocol: "https",
        hostname: "vumbnail.com",
      },
      {
        protocol: "https",
        hostname: "madinah-development.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com"
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "madinah.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "madinah.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "blog.madinah.com",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
      },
    ],
    formats: ["image/avif", "image/webp"], // AVIF has better compression than WebP
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
    dangerouslyAllowSVG: true, // Allow SVG images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Reduced device sizes to save memory
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Reduced image sizes
    unoptimized: process.env.HEROKU === "true" && process.env.NEXT_PUBLIC_ENV !== "production", // Allow optimization on production Vercel even if HEROKU is set
  },
  // i18n,
  reactStrictMode: true,

  // Enable Cache Components (PPR - Partial Prerendering)
  // This enables 'use cache' directive with cacheLife and cacheTag
  cacheComponents: true,

  // Cache life profiles for 'use cache' directive
  cacheLife: {
    campaign: {
      stale: 300,
      revalidate: 300,
      expire: 86400,
    },
    campaignContent: {
      stale: 300,
      revalidate: 300,
      expire: 86400,
    },
    supporters: {
      stale: 300,
      revalidate: 300,
      expire: 86400,
    },
    static: {
      stale: 3600,
      revalidate: 3600,
      expire: 86400,
    },
  },

  // Optimization improvements
  compress: true, // Enable Gzip/Brotli compression

  // React Compiler - automatically memoizes components to reduce re-renders and TBT
  // This eliminates the need for manual useMemo/useCallback in most cases
  reactCompiler: true,

  // Memory optimization for production
  productionBrowserSourceMaps: false, // Disable source maps in production to save memory
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/x-date-pickers",
      "react-icons",
      "date-fns",
      "dayjs",
      "lodash",
      "yup",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion",
      "@reduxjs/toolkit",
      "react-redux",
      "formik",
      "react-slick",
      "slick-carousel",
      "axios",
      "cookies-next",
      "react-hot-toast",
    ],
    // Tree shake unused code more aggressively
    esmExternals: true,
  },
  // Transpile specific packages to modern JS to reduce legacy JS overhead
  transpilePackages: [
    "swiper",
    "react-slick",
    "framer-motion",
    "@mui/material",
    "@mui/icons-material",
    "@mui/x-date-pickers",
  ],
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production", // Remove console.logs in production
  // },
  async rewrites() {
    return [
      {
        source: "/ph/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ph/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
  async headers() {
    return [
      // {
      //   // Cache homepage for Cloudflare (6 hours cache, stale-while-revalidate for 1 day)
      //   source: "/",
      //   headers: [
      //     {
      //       key: "Cache-Control",
      //       value: "public, max-age=21600, s-maxage=21600, stale-while-revalidate=21600",
      //     },
      //     {
      //       key: "CDN-Cache-Control",
      //       value: "max-age=21600, s-maxage=21600, stale-while-revalidate=21600",
      //     },
      //   ],
      // },
      // {
      //   // Cache all campaign landing pages for Cloudflare (6 hours cache, stale-while-revalidate for 1 day)
      //   // Campaign pages are at root level with dynamic slugs like /campaign-slug
      //   // Excludes known app routes that should not be cached
      //   source:
      //     "/:slug((?!about-us|account-settings|add-documents|campaign|campaign-success|category|cookie-policy|create-campaign|dashboard|donate-now|donation-success|donations|email-verification|guest-user|how-it-works|invite-user|notifications|preview|privacy-policy|reset-password|setup-transfers|statistics|summary|terms-and-conditions|your-donations|discover|api|_next|assets|ph|robots\\.txt)[^/]+)",
      //   headers: [
      //     {
      //       key: "Cache-Control",
      //       value: "public, max-age=21600, s-maxage=21600, stale-while-revalidate=21600",
      //     },
      //     {
      //       key: "CDN-Cache-Control",
      //       value: "max-age=21600, s-maxage=21600, stale-while-revalidate=21600",
      //     },
      //   ],
      // },
      {
        //   // Cache static assets from /public/assets for 1 year (CDN delivery via Cloudflare)
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/.well-known/apple-developer-merchantid-domain-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/octet-stream",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
  // async headers() {
  // 	return [
  // 		{
  // 			source: "/:path*", // Apply to all routes
  // 			headers: [
  // 				{
  // 					key: "Link",
  // 					value: "<https://www.madinah.com.com/:path>; rel=\"canonical\"",
  // 				},
  // 				{
  // 					key: "X-Robots-Tag",
  // 					value:
  // 						process.env.NODE_ENV === "production"
  // 							? "index, follow"
  // 							: "noindex, nofollow", // Conditional header
  // 				},
  // 			],
  // 		},
  // 	];
  // },

  // Font optimization
  // optimizeFonts: true, // Enable Next.js font optimization

  webpack(config, { isServer, dev }) {
    // Handle video files
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|ogv)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext][query]",
      },
    });

    // Handle SVG files - simpler approach
    config.module.rules.push({
      test: /\.svg$/,
      oneOf: [
        // Known large SVGs as static assets
        {
          test: /\/(blog3|instagram|whatsapp|telegram|youtube|twitter|facebook|nextDoor|slack|tiktok)\.svg$/,
          type: "asset/resource",
          generator: {
            filename: "static/svg/[name].[hash][ext][query]",
          },
        },
        // Small SVGs - let's try treating them as assets for now to fix the immediate issue
        {
          type: "asset",
          generator: {
            filename: "static/svg/[name].[hash][ext][query]",
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8KB - inline very small SVGs
            },
          },
        },
      ],
    });

    // Add optimization for large chunks (simplified to reduce memory overhead)
    if (!dev) {
      // Enable better tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        // Simplified splitChunks to reduce memory usage
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: "all",
          maxInitialRequests: 20, // Limit parallel requests
          maxAsyncRequests: 20, // Limit async requests
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Consolidated vendor chunk
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
            },
            // Only critical libraries get separate chunks
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: "mui",
              chunks: "all",
              priority: 20,
              reuseExistingChunk: true,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react",
              chunks: "all",
              priority: 25,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Handle font files for self-hosting
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: "asset/resource",
      generator: {
        filename: "static/fonts/[name].[hash][ext][query]",
      },
    });

    return config;
  },
};

export default nextConfig;
