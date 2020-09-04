import { useMemo } from 'react'

import { FieldType } from '@lib/types/fields'

interface Result {
  minLength: number | null
  maxLength: number | null
  min: number | null
  max: number | null
}

export default function useFieldLength(field: Partial<FieldType> = {}): Result {
  const minLength = useMemo(
    () => (typeof field.minlength !== 'undefined' ? field.minlength : null),
    [field?.minlength]
  )
  const maxLength = useMemo(
    () => (typeof field.maxlength !== 'undefined' ? field.maxlength : null),
    [field?.maxlength]
  )
  const max = useMemo(
    () => (typeof field.max !== 'undefined' ? field.max : null),
    [field?.max]
  )
  const min = useMemo(
    () => (typeof field.min !== 'undefined' ? field.min : null),
    [field?.min]
  )

  return { maxLength, minLength, min, max }
}
