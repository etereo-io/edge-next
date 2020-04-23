import Router from 'next/router'
import fetch from '../fetcher'
/*
  Loads current user, redirects if there is no user
*/
import { useEffect } from 'react'
import useSWR from 'swr'

export default function useUser({ redirectTo, redirectIfFound } = {}) {
  const { data, error } = useSWR('/api/users/me', fetch)
  const user = data ? data : null
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  useEffect(() => {
    if (!redirectTo || !finished) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, finished, hasUser])

  return {
    user: error ? null : user,
    finished,
  }
}
