import { ConfigType, ContentType } from '@lib/types'

import load from './load-config'

const config: ConfigType = load()

export default config

export const getContentTypeDefinition = (slug): ContentType | undefined  => {
  return config.content.types.find((item) => item.slug === slug)
}

export const getPermissions = () => {
  return config.permissions
}

export const getGroupTypeDefinition  = (slug): ContentType | undefined => {
  return config.groups.types.find((item) => item.slug === slug)
}