import {
  ExtendedColumn,
  Table as ReactTable,
} from '@components/generic/react-table'
import React, { memo, useCallback, useMemo, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { EmailType } from '@lib/types'
import { format } from 'timeago.js'
import { useInfinityList } from '@lib/client/hooks'

const limit = 10

function EmailsTable() {
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
  } = useInfinityList<EmailType>({
    url: `${API.email}`,
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

  const columns = useMemo<ExtendedColumn<EmailType>[]>(
    () => [
      {
        Header: 'To',
        id: 'to',
        accessor: 'to',
        sortable: true
      },
      {
        Header: 'Subject',
        id: 'subject',
        accessor: 'subject',
        sortable: true,
      },
      {
        Header: 'Created at',
        id: 'createdAt',
        sortable: true,
        accessor: ({ createdAt }) => format(createdAt),
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

export default memo(EmailsTable)
