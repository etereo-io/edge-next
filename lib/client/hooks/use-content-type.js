import { useEffect, useState } from 'react'

import { getContentTypeDefinition } from '../../config'

// Client side hook for getting the 
export default function useContentType(
  slug
) {
  const [contentType, setContentType] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    const contentTypeDefinition = getContentTypeDefinition(slug)

    if (!contentTypeDefinition) {
      setError(true)
    } else {
      setContentType(contentTypeDefinition)
    }
  }, [slug])

  return {
    contentType,
    error
  }
}
