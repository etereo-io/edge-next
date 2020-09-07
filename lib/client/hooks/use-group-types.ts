import { useEffect, useState } from 'react'

import config from '../../config'
import { hasPermission } from '../../permissions'
import useUser from './use-user'

// Client side hook for getting the content types that match the permissions
export  function useGroupTypes (
  permissions = [] // read, update, create, admin
) {
  const [groupTypes, setGroupTypes] = useState([])
  const { user } = useUser()

  useEffect(() => {
    if (permissions.length === 0) {
      setGroupTypes(config.content.types)
      return
    }

    const cTypes = config.groups.types.filter((type) => {
      return hasPermission(
        user,
        permissions.map((p) => `group.${type.slug}.${p}`)
      )
    })

    setGroupTypes(cTypes)
  }, [user])

  return groupTypes
}
