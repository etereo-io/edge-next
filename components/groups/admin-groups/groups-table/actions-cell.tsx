import React, { memo, useCallback, useState } from 'react'

import Button from '@components/generic/button/button'
import DropdownMenu from '@components/generic/dropdown-menu/dropdown-menu'
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
      <DropdownMenu align={'right'}>
        <ul>
          {!success && (
            <li>
              <Button fullWidth title="Edit" href={`/edit/group/${slug}/${item.seo.slug}`}>Edit</Button>
            </li>
          )}
          {!success && (
            <li>
              <Button fullWidth title="Borrar" loading={loading} success={true} onClick={onClickDelete}>
                Borrar
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
