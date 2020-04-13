/*
  Locks a page until the current user is the owner of the content, or an admin
  Redirects if needed
*/
import { useEffect, useState } from 'react'
import useUser from './use-user'
import Router from 'next/router'
import { hasPermission } from '../permissions'

export default function (
  content,
  redirectIfNotPermissions
) {
  const [available, setAvailable] = useState(false)
  const { user, finished } = useUser()

  useEffect(() => {
    // Wait until content and user has finished loading
    if (content && finished) {

      const canAccess = content.author === user.id || hasPermission(user, `content.${content.type}.admin`)

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
  }, [user, setAvailable, content, finished])

  return available
}
