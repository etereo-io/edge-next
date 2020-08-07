import { useState, memo, useCallback } from 'react'
import { format } from 'timeago.js'
import Link from 'next/link'

import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'
import { TableCellBody, TableRowBody } from '@components/generic/table/table'
import Button from '@components/generic/button/button'
import { GroupTypeDefinition } from '@lib/types'
import { GroupEntityType } from '@lib/types/entities/group'

interface Props {
  type: GroupTypeDefinition
  item: GroupEntityType
}

function ListItem({ type: { slug, publishing, fields }, item }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const deleteRequest = useCallback(() => {
    const url = `${API.groups[slug]}/${item.id}?field=id`
    return fetch(url, {
      method: 'delete',
    })
  }, [])

  const onClickDelete = useCallback(() => {
    const result = window.confirm('Are you sure you want to delete this item?')

    if (result) {
      setLoading(true)
      setSuccess(false)
      setError(false)

      deleteRequest()
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
    <TableRowBody>
      {fields.map(({ name }, index) => {
        const value = item[name] || '-'
        const content =
          index === 0 ? (
            <Link href={`/group/${slug}/${item.slug}`}>
              <a>{typeof value === 'string' ? value : JSON.stringify(value)}</a>
            </Link>
          ) : typeof value === 'string' ? (
            value
          ) : (
            JSON.stringify(value)
          )

        return (
          <TableCellBody
            key={`${item?.slug}-${index}`}
            style={{
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {content}
          </TableCellBody>
        )
      })}
      <TableCellBody>{format(item.createdAt)}</TableCellBody>
      {publishing.draftMode && (
        <TableCellBody>{item.draft ? 'DRAFT' : '-'}</TableCellBody>
      )}
      <TableCellBody>0 times</TableCellBody>
      <TableCellBody>
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
      </TableCellBody>
    </TableRowBody>
  )
}

export default memo(ListItem)
