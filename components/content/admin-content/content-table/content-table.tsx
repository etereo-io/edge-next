import { format } from 'timeago.js'
import { useState, memo } from 'react'
import Link from 'next/link'

import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '@components/generic/table/table'
import Placeholder from '@components/generic/loading/table-loading'
import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { useInfinityList } from '@lib/client/hooks'
import { GroupEntityType } from '@lib/types'

const ListItem = (props) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const deleteRequest = () => {
    const url = `${API.content[props.type.slug]}/${props.item.id}?field=id`
    return fetch(url, {
      method: 'delete',
    })
  }

  const onClickDelete = (ev) => {
    const result = window.confirm('Are you sure you want to delete this item?')

    if (result) {
      setLoading(true)
      setSuccess(false)
      setError(false)

      deleteRequest()
        .then((result) => {
          setLoading(false)
          setSuccess(true)
          setError(false)
        })
        .catch((err) => {
          setLoading(false)
          setSuccess(false)
          setError(true)
        })
    }
  }

  return (
    <TableRowBody>
      {props.type.fields.map((field, index) => {
        const value = props.item[field.name] ? props.item[field.name] : '-'
        const content =
          index === 0 ? (
            <Link href={`/content/${props.type.slug}/${props.item.slug}`}>
              <a>{typeof value === 'string' ? value : JSON.stringify(value)}</a>
            </Link>
          ) : typeof value === 'string' ? (
            value
          ) : (
            JSON.stringify(value)
          )

        return (
          <TableCellBody
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
      <TableCellBody>{format(props.item.createdAt)}</TableCellBody>
      {props.type.publishing.draftMode && (
        <TableCellBody>{props.item.draft ? 'DRAFT' : '-'}</TableCellBody>
      )}
      {props.type.comments.enabled && (
        <TableCellBody>{props.item.comments || 0}</TableCellBody>
      )}
      <TableCellBody>0 times</TableCellBody>
      <TableCellBody>
        {!success && (
          <Button href={`/edit/content/${props.type.slug}/${props.item.slug}`}>
            Edit
          </Button>
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

function ContentTable(props) {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('DESC')

  const {
    data,
    loadNewItems,
    isReachingEnd,
    isEmpty,
    isLoadingMore,
  } = useInfinityList<GroupEntityType>({
    url: `${API.content[props.type.slug]}`,
    limit: 10,
    sortBy,
    sortOrder,
  })

  const headerCells = props.type.fields.map((field) => {
    return (
      <TableCellHeader
        key={field.name}
        onClick={() => {
          setSortBy(field.name)
          setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
        }}
      >
        {field.name}
      </TableCellHeader>
    )
  })

  headerCells.push(
    <TableCellHeader
      onClick={() => {
        setSortBy('createdAt')
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      Created at
    </TableCellHeader>
  )

  if (props.type.publishing.draftMode) {
    headerCells.push(
      <TableCellHeader
        onClick={() => {
          setSortBy('draft')
          setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
        }}
      >
        Draft
      </TableCellHeader>
    )
  }

  if (props.type.comments.enabled) {
    headerCells.push(<TableCellHeader>Comments</TableCellHeader>)
  }

  headerCells.push(<TableCellHeader>Reported</TableCellHeader>)
  headerCells.push(<TableCellHeader>Actions</TableCellHeader>)

  return (
    <div className="content-list">
      <div className="table-wrapper">
        <Table headerCells={headerCells}>
          {data.map((item) => (
            <ListItem key={item.id} type={props.type} item={item} />
          ))}
          {isLoadingMore && <Placeholder />}
          {isEmpty && <div className="empty">Sorry, no items found.</div>}
        </Table>
      </div>

      <div className="load-more">
        {isReachingEnd ? null : (
          <Button loading={isLoadingMore} big={true} onClick={loadNewItems}>
            Load More
          </Button>
        )}
      </div>
      <style jsx>{`
        .table-wrapper {
          overflow-x: scroll;
        }

        .load-more {
          display: flex;
          margin: var(--edge-gap);
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default memo(ContentTable)
