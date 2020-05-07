const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
  env: {
    NEXT_PUBLIC_GMAPS_API_KEY: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
  },
})
