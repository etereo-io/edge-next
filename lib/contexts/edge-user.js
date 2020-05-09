import React, { useContext, useEffect, useReducer } from 'react'

import fetch from '../fetcher'
import useSWR from 'swr'

const EdgeStateContext = React.createContext()
const EdgeDispatchContenxt = React.createContext()

const reducer = (state, action) => {
  
  switch (action.type) {
    case 'USER':
      return {...state, user: action.payload, error: false, loaded: true}
    case 'NOT_USER':
        return {...state, user: null, error: true, loaded: true}
   
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

export const EdgeUserProvider = ({ children }) => {
  
  const [state, dispatch] = useReducer(reducer, {
    user: null
  })

  const { data, error } = useSWR( `/api/users/me`, fetch)

  const finished = Boolean(data) || Boolean(error)

  useEffect(() => {
    
    if (finished) {
      console.log(data, error)
      if (data) {
        dispatch({
          type: 'USER',
          payload: data
        })
      } else {
        dispatch({
          type: 'NOT_USER'
        })
      }
    }
  }, [finished, data, error])


  return (
    <EdgeDispatchContenxt.Provider value={dispatch}>
      <EdgeStateContext.Provider value={state}>
        {children}
      </EdgeStateContext.Provider>
    </EdgeDispatchContenxt.Provider>
  )
}

export const useUserState = () => useContext(EdgeStateContext)
export const useDispatchCount = () => useContext(EdgeDispatchContenxt)