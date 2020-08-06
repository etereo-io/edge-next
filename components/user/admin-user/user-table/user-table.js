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
import { useState } from 'react'
import { format } from 'timeago.js'

const ListItem = (props) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  // const [item, setItem] = useState(props.item)

  const blockRequest = (blockedStatus) => {
    const url = `${API.users}/${props.item.id}/block?field=id`

    return fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocked: blockedStatus,
      }),
    })
  }

  const onClickBlockUser = (ev) => {
    const result = window.confirm('Are you sure you want to block this user?')

    if (result) {
      setLoading(true)
      setError(false)

      blockRequest(!props.item.blocked)
        .then((result) => {
          setLoading(false)
          setError(false)
        })
        .catch((err) => {
          setLoading(false)
          alert('User could not be blocked')
        })
    }
  }

  const deleteRequest = () => {
    const url = `${API.users}/${props.item.id}?field=id`
    return fetch(url, {
      method: 'delete',
    })
  }

  const onClickDelete = (ev) => {
    const result = window.confirm('Are you sure you want to delete this user?')

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
          console.error(err)
        })
    }
  }

  return (
    <TableRowBody>
      <TableCellBody>
        <Link href={`/profile/${props.item.id}`}>
          <a>{props.item.username}</a>
        </Link>
      </TableCellBody>
      <TableCellBody>{props.item.email}</TableCellBody>
      <TableCellBody>{(props.item.roles || []).join(',')}</TableCellBody>
      <TableCellBody>{props.item.metadata.reported}</TableCellBody>
      <TableCellBody>
        {props.item.metadata.lastLogin
          ? format(props.item.metadata.lastLogin)
          : 'Never'}
      </TableCellBody>
      <TableCellBody>{format(props.item.createdAt)}</TableCellBody>
      <TableCellBody>{props.item.blocked ? 'Blocked' : '-'}</TableCellBody>
      <TableCellBody>
        {!success && <Button href={`/settings/${props.item.id}`}>Edit</Button>}
        {!success && (
          <Button loading={loading} alt={true} onClick={onClickDelete}>
            Delete
          </Button>
        )}

        <Button
          loading={loading}
          warning={!props.item.blocked}
          secondary={props.item.blocked}
          onClick={onClickBlockUser}
        >
          {props.item.blocked ? 'Unblock' : 'Block'}
        </Button>

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

  // Fetch user page by page
  const {
    pages,
    isLoadingMore,
    loadMore,
    isEmpty,
    isReachingEnd,
  } = useSWRPages(
    `admin-users-list`,
    ({ offset, withSWR }) => {
      const apiUrl = `${API.users}?limit=10${
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

  const headerCells = [
    <TableCellHeader
      onClick={() => {
        setSortBy('username')
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      Username
    </TableCellHeader>,
    <TableCellHeader
      onClick={() => {
        setSortBy('email')
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      Email
    </TableCellHeader>,
    <TableCellHeader>Roles</TableCellHeader>,
    <TableCellHeader>Reported</TableCellHeader>,
    <TableCellHeader
      onClick={() => {
        setSortBy('metadta.lastLogin')
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      Last Login
    </TableCellHeader>,
    <TableCellHeader
      onClick={() => {
        setSortBy('createdAt')
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      Created at
    </TableCellHeader>,
    <TableCellHeader
      onClick={() => {
        setSortBy('blocked')
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      Blocked
    </TableCellHeader>,
    <TableCellHeader>Actions</TableCellHeader>,
  ]

  return (
    <div className="content-list">
      <div className="table-wrapper">
        <Table headerCells={headerCells}>
          {pages}
          {isEmpty && <EmptyComponent />}
        </Table>
      </div>
      <div id="load-more">
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
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
