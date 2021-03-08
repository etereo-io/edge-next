import React, { memo } from 'react'

import Button from '@components/generic/button/button'
import { ContentEntityType } from '@lib/types'
import { contentPermission } from '@lib/permissions'
import { useUser } from '@lib/client/hooks'

type Props = {
  content?: Partial<ContentEntityType>
  className?: string
}

function ContentActions({ content = {}, className }: Props) {
  // Check permissions to edit
  const currentUser = useUser()
  const canEdit = contentPermission(
    currentUser.user,
    content.type,
    'update',
    content
  )

  return (
    <div className={`content-actions ${className}`}>
      {canEdit && (
        <Button href={`/edit/content/${content.type}/${content.seo.slug}`}>
          Edit
        </Button>
      )}
    </div>
  )
}

export default memo(ContentActions)
