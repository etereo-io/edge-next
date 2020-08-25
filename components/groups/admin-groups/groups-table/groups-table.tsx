import React, { useState, memo, useMemo, useCallback } from 'react'
import { format } from 'timeago.js'

import { GroupTypeDefinition } from '@lib/types/groupTypeDefinition'
import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { useInfinityList } from '@lib/client/hooks'
import { GroupEntityType } from '@lib/types/entities/group'
import {
  Table as ReactTable,
  ExtendedColumn,
} from '@components/generic/react-table'
import ActionsCell from './actions-cell'

import Link from 'next/link'
import fetch from '@lib/fetcher'

interface Props {
  type: GroupTypeDefinition
}

const limit = 3

function GroupsTable({ type }: Props) {
  const [{ sortBy, sortOrder }, setOrdering] = useState({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })

  const {
    data,
    loadNewItems,
    isReachingEnd,
    isLoadingMore,
    isEmpty,
  } = useInfinityList<GroupEntityType>({
    url: `${API.groups[type.slug]}`,
    sortBy,
    sortOrder,
    limit,
    config: { revalidateOnFocus: false },
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

  const deleteRequest = useCallback((slug, id) => {
    const url = `${API.groups[slug]}/${id}?field=id`

    return fetch(url, {
      method: 'delete',
    })
  }, [])

  const columns = useMemo(() => {
    const columnsConfig: ExtendedColumn<GroupEntityType>[] = type.fields.map(
      ({ name }, index) => ({
        Header: name,
        id: name,
        sortable: true,
        Cell: ({ row: { original: item } }) => {
          const value =
            typeof item[name] === 'string'
              ? item[name]
              : JSON.stringify(item[name])

          if (index === 0) {
            return (
              <Link href={`/group/${type.slug}/${item.slug}`}>
                <a>{value}</a>
              </Link>
            )
          }

          return value
        },
      })
    )

    columnsConfig.push({
      Header: 'Created at',
      id: 'createdAt',
      accessor: 'createdAt',
      Cell: ({ value }) => format(value),
      sortable: true,
    })

    if (type.publishing.draftMode) {
      columnsConfig.push({
        Header: 'Draft',
        id: 'draft',
        Cell: ({ value }) => value || '-',
        sortable: true,
        justifyContent: 'center',
      })
    }

    columnsConfig.push(
      {
        Header: 'Reported',
        id: 'reported',
        Cell: ({ value }) => `${value || 0} times`,
      },
      {
        Header: 'Actions',
        Cell: ({ row: { original } }) => (
          <ActionsCell
            item={original}
            slug={type.slug}
            deleteRequest={deleteRequest}
          />
        ),
        minWidth: 150,
        headerAlign: 'center',
        justifyContent: 'space-evenly',
      }
    )

    return columnsConfig
  }, [])

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
          padding: 1rem;
          display: block;
          overflow: auto;
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

export default memo(GroupsTable)
