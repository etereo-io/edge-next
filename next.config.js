const withPWA = require('next-pwa')
const path = require('path')

module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
  env: {
    NEXT_PUBLIC_GMAPS_API_KEY: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
  },

  webpack(config) {
    config.resolve.alias['@lib'] = path.join(__dirname, 'lib')
    config.resolve.alias['@components'] = path.join(__dirname, 'components')
    return config
  },
})
