import load from './load-config'

const config = load()

export default config

export const getContentTypeDefinition = (slug) => {
  return config.content.types.find((item) => item.slug === slug)
}
