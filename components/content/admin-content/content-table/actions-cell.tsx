import React, { memo, useCallback, useState } from 'react'

import Button from '@components/generic/button/button'
import { ContentEntityType } from '@lib/types'

interface Props {
  slug: string
  deleteRequest: (slug: string, id: string) => Promise<any>
  item: ContentEntityType
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
        <div className="button-wr">
          <Button href={`/edit/content/${slug}/${item.slug}`}>Edit</Button>
        </div>
      )}
      {!success && (
        <div className="button-wr">
          <Button loading={loading} success={true} onClick={onClickDelete}>
            Delete
          </Button>
        </div>
      )}
      {error && <div className="error">Error deleting item</div>}
      {success && <div className="success">Item deleted</div>}
    
      <style jsx>{`
      .button-wr{
        margin: 0 8px 0 8px;
      }

      .button-wr:last-of-type{
        margin: 0;
      }
    `}</style>
    </>
  )
}

export default memo(ActionsCell)
