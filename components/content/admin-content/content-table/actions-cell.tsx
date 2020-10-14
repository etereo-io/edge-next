import React, { memo, useCallback, useState } from 'react'

import Button from '@components/generic/button/button'
import { ContentEntityType } from '@lib/types'
import DropdownMenu from '@components/generic/dropdown-menu/dropdown-menu'

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
      <DropdownMenu align={'right'}>
        <ul>
          {!success && (
            <li>
              <Button fullWidth title="Edit" href={`/edit/content/${slug}/${item.slug}`}>Edit</Button>
            </li>
          )}
          {!success && (
            <li >
              <Button fullWidth title="Delete" loading={loading} success={true} onClick={onClickDelete}>
                Delete
              </Button>
            </li>
          )}
          {error && <li><div className="error">Error deleting item</div></li>}
          {success && <li><div className="success">Item deleted</div></li>}
        </ul>
      </DropdownMenu>
      
      <style jsx>{`
      

      
    `}</style>
    </>
  )
}

export default memo(ActionsCell)
