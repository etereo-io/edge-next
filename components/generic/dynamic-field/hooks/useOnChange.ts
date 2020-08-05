import { ChangeEvent, useCallback, useState } from 'react'

interface Props {
  onChangeHandler: (
    value: string | number,
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void
}

interface Result {
  touched: boolean
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void
}

export default function({ onChangeHandler }: Props): Result {
  const [touched, setTouched] = useState(false)

  const onChange = useCallback(
    (event) => {
      setTouched(true)
      onChangeHandler(event.target.value, event)
    },
    [onChangeHandler, setTouched]
  )

  return {
    onChange,
    touched,
  }
}
