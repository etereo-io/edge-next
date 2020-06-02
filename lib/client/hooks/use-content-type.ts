import { useEffect, useState } from 'react'

import { ContentType } from '@lib/types'
import { getContentTypeDefinition } from '@lib/config'

declare type UseContentTypeResponse = {
  contentType: ContentType;
  error: boolean;
}

// Client side hook for getting the
export default function useContentType(slug): UseContentTypeResponse {
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
    error,
  }
}
