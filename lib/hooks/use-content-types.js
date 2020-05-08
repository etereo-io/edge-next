import { useEffect, useState } from 'react'

import config from '../config'
import { hasPermission } from '../permissions'
import useUser from './use-user'

// Client side hook for getting the content types that match the permissions
export default function useContentTypes(
  permissions = [] // read, update, create, admin
) {
  const [contentTypes, setContentTypes] = useState([])
  const { user } = useUser()

  useEffect(() => {
    if (permissions.length === 0 ) {
      setContentTypes(config.content.types)
      return
    }

    const cTypes = config.content.types.filter((type) => {
      return hasPermission(user, permissions.map(p => `content.${type.slug}.${p}`))
    })

    setContentTypes(cTypes)
  }, [user])

  return contentTypes
}
