import React, { createContext, useEffect, useState } from 'react'

import storage from '../storage'

type CookiesType = {
  statistics: boolean,
  functional: boolean
}
export const CookiesContext = createContext<{accepted: boolean, accept: () => void, cookies: CookiesType,  setCookies: (val: CookiesType) => void}>({
  accepted: false,
  accept: () => {},
  cookies: {
    statistics: true,
    functional: true
  },
  setCookies: (val: CookiesType) => null
})

export const CookiesProvider = ({ children } : any) => {
  const [accepted, setAccepted] = useState(false)
  const [cookies, setStateCookies] = useState({
    functional: true,
    statistics: true
  })

  const accept = () => {
    setAccepted(true)
    storage.set('cookies', JSON.stringify({ accepted: true, cookies, date: Date.now()}))
  }

  // Load previous cookies storage
  useEffect(() => {
    const prevCookies = storage.get('cookies', true)
    setAccepted(prevCookies ? prevCookies.accepted : false)
    setCookies(prevCookies && prevCookies.cookies ? prevCookies.cookies: cookies)
  }, [])

  const setCookies = (val: CookiesType) => {
    setStateCookies(val)
    storage.set('cookies', JSON.stringify({ accepted, cookies: val, date: Date.now()}))
  } 

  return (
    <CookiesContext.Provider value={{ accepted, accept, cookies, setCookies }}>
      {children}
    </CookiesContext.Provider>
  )
}
