import load from './load-config'

const config = load()

export default config

export const getContentType = (slug) => {
  return config.contentTypes.find(item => item.slug === slug)
}