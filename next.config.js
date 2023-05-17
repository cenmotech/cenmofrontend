/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      NEXT_PUBLIC_DEV: process.env.NEXT_PUBLIC_DEV,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
          port: '',
          pathname: '/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/800px-Eq_it-na_pizza-margherita_sep2005_sml.jpg',
        },
        {
          protocol: 'https',
          hostname: 'www.recipetineats.com',
          port: '',
          pathname: '/wp-content/uploads/2020/05/Pepperoni-Pizza_5-SQjpg.jpg',
        },
        {
          protocol: 'https',
          hostname: 'asset.kompas.com',
          port: '',
          pathname: '/crops/teG8bxBeC9NzNi6opEf38UDC74Q=/0x0:1000x667/750x500/data/photo/2020/09/22/5f69e601777db.jpg',
        },
        {
          protocol: 'https',
          hostname: 'awsimages.detik.net.id',
          port: '',
          pathname: '/community/media/visual/2021/07/06/perbedaan-pizza-italia-dan-pizza-amerika-2.jpeg',
        },
        {
          protocol: 'https',
          hostname: 'www.kingarthurbaking.com',
          port: '',
          pathname: '/sites/default/files/styles/featured_image/public/2022-03/Easiest-Pizza_22-2_11.jpg',
        },
      ]
    }
  }
  
  module.exports = nextConfig

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "universitas-indonesia-wi",
    project: "cenmo-frontend",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
