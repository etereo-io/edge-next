import React, { useState, memo, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { format } from 'timeago.js'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { useInfinityList } from '@lib/client/hooks'
import { UserType } from '@lib/types'
import {
  ExtendedColumn,
  Table as ReactTable,
} from '@components/generic/react-table'

import ActionsCell from './actions-cell'

const limit = 10

function UserTable() {
  const [{ sortBy, sortOrder }, setOrdering] = useState({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })
  const {
    data,
    loadNewItems,
    isReachingEnd,
    isEmpty,
    isLoadingMore,
  } = useInfinityList<UserType>({
    url: `${API.users}`,
    limit,
    sortBy,
    sortOrder,
    config: {
      revalidateOnFocus: false,
    },
  })

  const changeOrdering = useCallback(
    (options: Array<{ field: string; order: string }>) => {
      if (options.length) {
        const [{ field, order }] = options

        setOrdering({ sortBy: field, sortOrder: order })
      } else {
        setOrdering({ sortBy: '', sortOrder: '' })
      }
    },
    [setOrdering]
  )

  const blockRequest = useCallback(
    (id, blockedStatus) => {
      const url = `${API.users}/${id}/block?field=id`

      return fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocked: blockedStatus,
        }),
      })
    },
    []
  )

  const deleteRequest = useCallback((id) => {
    const url = `${API.users}/${id}?field=id`

    return fetch(url, {
      method: 'delete',
    })
  }, [])

  const columns = useMemo<ExtendedColumn<UserType>[]>(
    () => [
      {
        Header: 'Username',
        id: 'username',
        accessor: 'username',
        sortable: true,
        Cell: ({
          value,
          row: {
            original: { id },
          },
        }) => (
          <Link href={`/profile/${id}`}>
            <a>{value}</a>
          </Link>
        ),
      },
      {
        Header: 'Email',
        id: 'email',
        accessor: 'email',
        sortable: true,
      },
      {
        Header: 'Roles',
        id: 'roles',
        sortable: false,
        accessor: ({ roles }) => (roles || []).join(','),
      },
      {
        Header: 'Reported',
        id: 'metadata.reported',
        sortable: false,
        accessor: ({ metadata: { reported } }) => reported,
      },
      {
        Header: 'Last login',
        id: 'metadata.lastLogin',
        sortable: true,
        accessor: ({ metadata: { lastLogin } }) =>
          lastLogin ? format(lastLogin) : 'Never',
      },
      {
        Header: 'Created at',
        id: 'createdAt',
        sortable: true,
        accessor: ({ createdAt }) => format(createdAt),
      },
      {
        Header: 'Blocked',
        id: 'blocked',
        sortable: true,
        accessor: ({ blocked }) => (blocked ? 'Blocked' : '-'),
      },
      {
        Header: 'Actions',
        Cell: ({
          row: {
            original: { id, blocked },
          },
        }) => (
          <ActionsCell
            id={id}
            blocked={blocked}
            deleteRequest={deleteRequest}
            blockRequest={blockRequest}
          />
        ),
        minWidth: 150,
        headerAlign: 'center',
        justifyContent: 'space-evenly',
      },
    ],
    []
  )

  return (
    <div className="content-list">
      <div className="table-wrapper">
        <ReactTable
          columns={columns as ExtendedColumn<object>[]}
          data={data}
          limit={limit}
          isEmpty={isEmpty}
          loading={isLoadingMore}
          initialState={{ sortBy: [{ id: 'createdAt', desc: true }] }}
          fetchData={changeOrdering}
        />
      </div>

      <div className="load-more">
        {!isReachingEnd && (
          <Button loading={isLoadingMore} big={true} onClick={loadNewItems}>
            Load More
          </Button>
        )}
      </div>
      <style jsx>{`
        .table-wrapper {
          display: block;
          overflow: auto;
          position: relative;
          margin: 40px 0 24px;
        }

        .content-list {
          position: relative;
        }
        .content-list:after {
          background: linear-gradient(
            to left,
            var(--accents-1-medium) 0%,
            transparent 100%
          );
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          width: 16px;
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

export default memo(UserTable)
