import { ConfigType } from '../types/config'
import { ContentType } from '../types/contentType'
import load from './load-config'

const config: ConfigType = load()

export default config

export const getContentTypeDefinition: ContentType = (slug) => {
  return config.content.types.find((item) => item.slug === slug)
}

export const getPermissions = () => {
  return config.permissions
}
