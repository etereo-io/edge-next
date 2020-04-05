import { useEffect } from 'react'

import Router from 'next/router'
import useSWR from 'swr'
import fetch from '../fetcher'

const fetcher = (url) =>
  fetch(url)
    .then((data) => {
      return { user: data ? data.user : null }
    })

export default function useUser({ redirectTo, redirectIfFound } = {}) {
  const { data, error } = useSWR('/api/user', fetcher)
  const user = data ? data.user : null
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
