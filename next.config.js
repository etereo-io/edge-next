const withPWA = require('next-pwa')
const path = require('path')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  env: {
    NEXT_PUBLIC_GMAPS_API_KEY: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
  },  
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  webpack(config) {
    config.resolve.alias['@lib'] = path.join(__dirname, 'lib')
    config.resolve.alias['@components'] = path.join(__dirname, 'components')
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config
  },
})
