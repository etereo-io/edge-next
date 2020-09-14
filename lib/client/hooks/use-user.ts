import Router from 'next/router'
import { UserType } from '@lib/types'
import { useEffect } from 'react'
import { useUserState } from '../contexts/edge-user'

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
  const userState = useUserState()

  useEffect(() => {
    if (!redirectTo || !userState.loaded) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !userState.user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && userState.user)
    ) {
      Router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, userState.loaded, userState.user])

  return {
    user: userState.user,
    error: userState.error,
    finished: userState.loaded,
  }
}
