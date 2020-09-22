import { useCallback, useEffect, useState } from 'react'

import usePrevious from '@lib/client/hooks/use-previous'

export default function useTab(initialValue: string | number = '') {
  const [value, setValue] = useState<string | number>(initialValue)

  const prevInitValue = usePrevious(initialValue)

  useEffect(() => {
    if(!prevInitValue && initialValue) {
      setValue(initialValue)
    }
  })

  const onChange = useCallback((event, tab) => setValue(tab), [setValue])
  const isActive = useCallback((tab) => value === tab, [value])

  return {
    value,
    setValue,
    onChange,
    isActive,
  }
}
