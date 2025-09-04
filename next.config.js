// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // disable app/ router if you're using pages/
  },
  // Tell Next.js where to look for pages
  dir: './src'
}

module.exports = nextConfig;