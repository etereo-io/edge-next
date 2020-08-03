import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '../../../generic/table/table'

import LoadingPlaceholder from '../../../generic/loading/loading-placeholder/loading-placeholder'

import useSWR, { useSWRPages } from 'swr'

import API from '@lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import Link from 'next/link'
import fetch from '@lib/fetcher'
import { format } from 'timeago.js'
import { useState } from 'react'

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

function Placeholder() {
  return (
    <>
      <TableRowBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
      </TableRowBody>
      <TableRowBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
        <TableCellBody>
          <LoadingPlaceholder />
        </TableCellBody>
      </TableRowBody>
    </>
  )
}

function EmptyComponent() {
  return <div className="empty">Sorry, no items found.</div>
}

export default function (props) {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('DESC')

  // Fetch content type page by page
  const {
    pages,
    isLoadingMore,
    loadMore,
    isEmpty,
    isReachingEnd,
  } = useSWRPages(
    `admin-content-${props.type.slug}-list`,
    ({ offset, withSWR }) => {
      const apiUrl = `${API.content[props.type.slug]}?limit=10${
        offset ? '&from=' + offset : ''
      }&sortBy=${sortBy}&sortOrder=${sortOrder}`
      const { data } = withSWR(useSWR(apiUrl, fetch))

      if (!data) return <Placeholder />

      const { results } = data
      return results.map((item) => {
        return <ListItem key={item.id} type={props.type} item={item} />
      })
    },
    (SWR) => {
      // Calculates the next page offset
      return SWR.data && SWR.data.results && SWR.data.results.length >= 10
        ? SWR.data.from * 1 + SWR.data.limit * 1
        : null
    },
    [sortOrder]
  )

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
          {pages}
          {isEmpty && <EmptyComponent />}
        </Table>
      </div>

      <div className="load-more">
        {isReachingEnd ? null : (
          <Button loading={isLoadingMore} big={true} onClick={loadMore}>
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
