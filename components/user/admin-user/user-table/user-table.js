import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '../../../generic/table/table'
import useSWR, { useSWRPages } from 'swr'

import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import Link from 'next/link'
import fetch from '../../../../lib/fetcher'
import { useState } from 'react'

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
        blocked: blockedStatus
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
          console.log(result)
          setLoading(false)
          setError(false)
        })
        .catch((err) => {
          setLoading(false)
          alert('User could not be blocked')
          console.error(err)
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
          console.log(result)
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
      <TableCellBody>{props.item.metadata.reported}</TableCellBody>
      <TableCellBody>{props.item.metadata.lastLogin}</TableCellBody>
      <TableCellBody>{props.item.blocked ? 'Blocked' : '-'}</TableCellBody>
      <TableCellBody>
        {!success && <Button href={`/settings/${props.item.id}`}>Edit</Button>}
        {!success && (
          <Button loading={loading} alt={true} onClick={onClickDelete}>
            Delete
          </Button>
        )}
        
        <Button loading={loading} alt={true} onClick={onClickBlockUser}>
          Block user
        </Button>
        
        {error && <div className="error">Error deleting item</div>}
        {success && <div className="success">Item deleted</div>}
      </TableCellBody>
    </TableRowBody>
  )
}

function Placeholder() {
  return (
    <div className="placeholders">
      <div className="p"></div>
      <div className="p"></div>
      <div className="p"></div>
      <div className="p"></div>
      <div className="p"></div>
    </div>
  )
}

function EmptyComponent() {
  return <div className="empty">Sorry, no items found.</div>
}

export default function (props) {
  // Fetch content type page by page
  const {
    pages,
    isLoadingMore,
    loadMore,
    isEmpty,
    isReachingEnd,
  } = useSWRPages(
    `admin-users-list`,
    ({ offset, withSWR }) => {
      const apiUrl = `${API.users}?limit=10${offset ? '&from=' + offset : ''}`
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
    []
  )

  const headerCells = [
    <TableCellHeader>Username</TableCellHeader>,
    <TableCellHeader>Email</TableCellHeader>,
    <TableCellHeader>Reported</TableCellHeader>,
    <TableCellHeader>Last Login</TableCellHeader>,
    <TableCellHeader>Blocked</TableCellHeader>,
    <TableCellHeader>Actions</TableCellHeader>,
  ]

  return (
    <div className="content-list">
      <Table headerCells={headerCells}>
        {!isEmpty ? pages : <EmptyComponent />}
      </Table>

      <div id="load-more">
        {isReachingEnd ? null : (
          <Button loading={isLoadingMore} big={true} onClick={loadMore}>
            Load More
          </Button>
        )}
      </div>
      <style jsx>{`
        .load-more {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
