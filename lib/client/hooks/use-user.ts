import { useContext, useEffect } from 'react'

import Router from 'next/router'
import { UserContext } from '../contexts/user-context'
import { UserType } from '@lib/types'

declare type UseUserResponse = {
  user: UserType
  error: boolean
  finished: boolean
}
/*
  Loads current user, redirects if there is no user
*/
export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
} = {}): UseUserResponse {

  const { user, loaded, error } = useContext(UserContext)

  useEffect(() => {
    if (!redirectTo || !loaded) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user)
    ) {
      Router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, loaded, user])

  return {
    user: user,
    error: error,
    finished: loaded,
  }
}
