import Router from 'next/router'
import fetch from '../fetcher'
/*
  Loads current user, redirects if there is no user
*/
import { useEffect } from 'react'
import useSWR from 'swr'
import { useUserState } from '../contexts/edge-user'

export default function useUser(
  { redirectTo, redirectIfFound, userId } = {},
  initialUser
) {
  const userState = useUserState()
console.log(userState)
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
