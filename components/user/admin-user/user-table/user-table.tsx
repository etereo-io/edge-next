import { useState, memo } from 'react'
import Link from 'next/link'
import { format } from 'timeago.js'

import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '@components/generic/table/table'
import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { useInfinityList } from '@lib/client/hooks'
import { UserType } from '@lib/types'
import Placeholder from '@components/generic/loading/table-loading'

const ListItem = (props) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

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
        <span className="table-actions">
          {!success && (
            <Button href={`/settings/${props.item.id}`}>Edit</Button>
          )}
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
        </span>
      </TableCellBody>
      <style jsx>
        {`
          .table-actions {
            display: flex;
            justify-content: space-evenly;
          }
        `}
      </style>
    </TableRowBody>
  )
}

function UserTable(props) {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('DESC')

  const {
    data,
    loadNewItems,
    isReachingEnd,
    isEmpty,
    isLoadingMore,
  } = useInfinityList<UserType>({
    url: `${API.users}`,
    limit: 10,
    sortBy,
    sortOrder,
  })

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
    <TableCellHeader className="center">Actions</TableCellHeader>,
  ]

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
          justify-content: center;
          margin-top: 10px;
        }

        .content-list {
          margin-top: 10px;
        }
      `}</style>
    </div>
  )
}

export default memo(UserTable)
