import Router from 'next/router'
import { useEffect } from 'react'
import { useUserState } from '../contexts/edge-user'

/*
  Loads current user, redirects if there is no user
*/
export default function useUser({ redirectTo, redirectIfFound } = {}) {
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
    user: userState.error ? null : userState.user,
    finished: userState.loaded,
  }
}
