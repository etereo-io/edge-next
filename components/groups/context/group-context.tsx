import React from 'react'

type Type = {
  onSubmitEvent: (values?: any) => void
}

export default React.createContext<Type | undefined>(undefined)
