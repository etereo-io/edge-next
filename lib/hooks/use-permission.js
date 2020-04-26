import Router, { useRouter } from 'next/router'
/*
  Locks a page until the current user has the demanded permissions
  Redirects if needed
*/
import { useEffect, useState } from 'react'

import { hasPermission } from '../permissions'
import useUser from './use-user'

export default function (
  permission,
  redirectIfNotPermissions,
  waitUntilRouterReadyForSlug,
  initialUser
) {
  const [available, setAvailable] = useState(false)
  const { user, finished } = useUser({}, initialUser)

  const { query } = useRouter()

  const useEffectParams = [user, setAvailable, finished]

  if (waitUntilRouterReadyForSlug) {
    useEffectParams.push(query[waitUntilRouterReadyForSlug])
  }

  useEffect(() => {
    const routerLoaded =
      (waitUntilRouterReadyForSlug && query[waitUntilRouterReadyForSlug]) ||
      !waitUntilRouterReadyForSlug

    // Wait until router and user has finished loading
    if (routerLoaded && finished) {

      const canAccess = hasPermission(user, permission)

      if (!canAccess) {
        // Redirect if specified
        if (redirectIfNotPermissions) {
          Router.push(redirectIfNotPermissions)
        }
      } else {
        // Unlock page
        setAvailable(true)
      }
    }
  }, useEffectParams)

  return available
}
