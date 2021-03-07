import React from 'react'
import { UserType } from '@lib/types'
import fetch from '../../fetcher'
import useSWR from 'swr'

export const UserContext = React.createContext<{
  user: UserType | null
  loaded?: boolean
  error?: any,
  onLogout: () => void
}>({
  user: null,
  onLogout: () => null
})

export const UserProvider = ({ children }) => {

  const { data, error } = useSWR(`/api/users/me`, fetch, { errorRetryCount: 2 })

  const loaded = Boolean(data) || Boolean(error)

  const onLogout = async () => {

    // Invalidate caches for service worker
    await caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          return caches.delete(key)
        })
      )
    })

    window.location.href = '/api/auth/logout'
  }


  return (
    <UserContext.Provider value={{ onLogout, user: data, loaded, error }}>
      {children}
    </UserContext.Provider>
  )
}
