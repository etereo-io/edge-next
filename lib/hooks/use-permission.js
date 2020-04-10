import { useEffect, useState } from 'react'
import useUser from './use-user'
import Router, { useRouter } from 'next/router'
import { hasPermission } from '../permissions'

export default function (
  permission,
  redirectIfNotPermissions,
  waitUntilRouterReadyForSlug
) {
  const [locked, setLocked] = useState(true)
  const { user, finished } = useUser()

  const { query } = useRouter()

  const useEffectParams = [user, setLocked, finished]

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
        setLocked(false)
      }
    }
  }, useEffectParams)

  return locked
}
