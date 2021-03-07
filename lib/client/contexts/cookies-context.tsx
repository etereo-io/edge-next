import React, { createContext, useEffect, useState } from 'react'

import storage from '../storage'

export const CookiesContext = createContext<{accepted: boolean, accept: () => void}>({
  accepted: false,
  accept: () => {}
})

export const CookiesProvider = ({ children } : any) => {
  const [accepted, setAccepted] = useState(false)

  const accept = () => {
    setAccepted(true)
    storage.set('cookies', JSON.stringify({ accepted: true, date: Date.now()}))
  }

  // Load previous cookies storage
  useEffect(() => {
    const prevCookies = storage.get('cookies', true)
    setAccepted(prevCookies ? prevCookies.accepted : false)
  }, [])

  return (
    <CookiesContext.Provider value={{ accepted, accept }}>
      {children}
    </CookiesContext.Provider>
  )
}
