/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/templates',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oobtxuazqbzntvhmvjtj.supabase.co',
        port: ''
      },
    ],
  },
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    PRODUCT_PRICE_ID: process.env.PRODUCT_PRICE_ID,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    REACT_APP_LICENSE: process.env.REACT_APP_LICENSE
  },
  compiler: {
    removeConsole: true,
  }
}

module.exports = nextConfig
