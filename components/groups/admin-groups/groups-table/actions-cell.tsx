import React, { memo, useCallback, useState } from 'react'

import Button from '@components/generic/button/button'
import { GroupEntityType } from '@lib/types/entities/group'

interface Props {
  slug: string
  deleteRequest: (slug: string, id: string) => Promise<any>
  item: GroupEntityType
}

function ActionsCell({ slug, deleteRequest, item }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const onClickDelete = useCallback(() => {
    const result = window.confirm('Are you sure you want to delete this item?')

    if (result) {
      setLoading(true)
      setSuccess(false)
      setError(false)

      deleteRequest(slug, item.id)
        .then(() => {
          setLoading(false)
          setSuccess(true)
          setError(false)
        })
        .catch(() => {
          setLoading(false)
          setSuccess(false)
          setError(true)
        })
    }
  }, [setLoading, setSuccess, setError])

  return (
    <>
      {!success && (
        <Button href={`/edit/group/${slug}/${item.slug}`}>Edit</Button>
      )}
      {!success && (
        <Button loading={loading} alt={true} onClick={onClickDelete}>
          Delete
        </Button>
      )}
      {error && <div className="error">Error deleting item</div>}
      {success && <div className="success">Item deleted</div>}
    </>
  )
}

export default memo(ActionsCell)
