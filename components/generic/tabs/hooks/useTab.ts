import { useCallback, useState } from 'react'

export default function useTab(initialValue: string | number) {
  const [value, setValue] = useState<string | number>(initialValue)

  const onChange = useCallback((event, tab) => setValue(tab), [setValue])
  const isActive = useCallback((tab) => value === tab, [value])

  return {
    value,
    setValue,
    onChange,
    isActive,
  }
}
