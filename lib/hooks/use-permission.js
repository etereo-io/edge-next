/*
  Locks a page until the current user has the demanded permissions
  Redirects if needed
*/

import { useEffect, useState } from 'react'

import Router from 'next/router'
import { hasPermission } from '../permissions'
import useUser from './use-user'

export default function (
  permission = [],
  redirectIfNotPermissions,
) {
  const [available, setAvailable] = useState(false)
  
  const [
    finishedCheckingPermissions,
    setFinishedCheckingPermissions,
  ] = useState(false)

  // Check against current user
  const { user, finished } = useUser()

  useEffect(() => {
    // Wait until router and user has finished loading
    if (permission && permission.length > 0 && finished) {
      let canAccess = hasPermission(user, permission)

      if (!canAccess) {
        // Redirect if specified
        if (redirectIfNotPermissions) {
          Router.push(redirectIfNotPermissions)
        }
      } else {
        // Unlock page
        setAvailable(true)
      }

      setFinishedCheckingPermissions(true)
    }
  }, [user, setAvailable, finished, permission])

  return {
    available,
    finished: finishedCheckingPermissions,
  }
}
