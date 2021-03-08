import { ContentEntityType, ContentTypeDefinition } from '@lib/types'
import {
  ExtendedColumn,
  Table as ReactTable,
} from '@components/generic/react-table'
import React, { memo, useCallback, useMemo, useState } from 'react'

import API from '@lib/api/api-endpoints'
import ActionsCell from './actions-cell'
import Button from '@components/generic/button/button'
import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import Link from 'next/link'
import fetch from '@lib/fetcher'
import { format } from 'timeago.js'
import { useInfinityList } from '@lib/client/hooks'

const limit = 10

type Props = {
  type: ContentTypeDefinition
}

function ContentTable({ type }: Props) {

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
  } = useInfinityList<ContentEntityType>({
    url: `${API.content[type.slug]}`,
    limit: 10,
    sortBy,
    sortOrder,
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
    const url = `${API.content[slug]}/${id}?field=id`

    return fetch(url, {
      method: 'delete',
    })
  }, [])

  const columns = useMemo(() => {
    const columnsConfig: ExtendedColumn<ContentEntityType>[] = type.fields.map(
      ({ name, label }, index) => ({
        Header: label || name,
        id: name,
        sortable: true,
        Cell: ({ row: { original: item } }) => {
          const componentCell = <DynamicFieldView
            field={type.fields.find(i => i.name === name)}
            value={item[name]}
            typeDefinition={type} />

          if (index === 0) {
            return (
              <Link href={`/content/${type.slug}/${item.seo.slug}`}>
                <a title={label || name}>{componentCell}</a>
              </Link>
            )
          }

          return componentCell
        },
      })
    )

    columnsConfig.push({
      Header: 'Created',
      id: 'createdAt',
      accessor: 'createdAt',
      Cell: ({ value }) => format(value, 'es'),
      sortable: true,
    })

    if (type.publishing.draftMode) {
      columnsConfig.push({
        Header: 'Draft',
        id: 'draft',
        accessor: 'draft',
        Cell: ({ value }) => (value ? 'DRAFT' : '-'),
        sortable: true,
        justifyContent: 'center',
      })
    }

    if (type.comments.enabled) {
      columnsConfig.push({
        Header: 'Comments',
        id: 'comments',
        accessor: 'comments',
        Cell: ({ value }) => value || '-',
        sortable: false,
        justifyContent: 'center',
      })
    }

    columnsConfig.push({
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
    })

    return columnsConfig
  }, [type])

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
          <Button title="Load more" loading={isLoadingMore} big={true} onClick={loadNewItems}>
            Load more
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

export default memo(ContentTable)
