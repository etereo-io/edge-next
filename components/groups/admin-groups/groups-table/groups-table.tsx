import React, { useState, memo } from 'react'

import Table, { TableCellHeader } from '@components/generic/table/table'
import { GroupTypeDefinition } from '@lib/types/groupTypeDefinition'
import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { useInfinityList } from '@lib/client/hooks'
import { GroupEntityType } from '@lib/types/entities/group'
import Placeholder from '@components/generic/loading/table-loading'

import ListItem from './list-item'

interface Props {
  type: GroupTypeDefinition
}

function GroupsTable({ type }: Props) {
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<string>('DESC')

  const {
    data,
    loadNewItems,
    isReachingEnd,
    isEmpty,
    isLoadingMore,
  } = useInfinityList<GroupEntityType>({
    url: `${API.groups[type.slug]}`,
    sortBy,
    sortOrder,
    limit: 10,
  })

  const headerCells = type.fields.map((field) => (
    <TableCellHeader
      key={field.name}
      onClick={() => {
        setSortBy(field.name)
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      {field.name}
    </TableCellHeader>
  ))

  headerCells.push(
    <TableCellHeader
      key="created_at"
      onClick={() => {
        setSortBy('createdAt')
        setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
      }}
    >
      Created at
    </TableCellHeader>
  )

  if (type.publishing.draftMode) {
    headerCells.push(
      <TableCellHeader
        key="draft"
        onClick={() => {
          setSortBy('draft')
          setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
        }}
      >
        Draft
      </TableCellHeader>
    )
  }

  headerCells.push(
    <TableCellHeader key="reported">Reported</TableCellHeader>,
    <TableCellHeader key="actions">Actions</TableCellHeader>
  )

  return (
    <div className="content-list">
      <div className="table-wrapper">
        <Table headerCells={headerCells}>
          {data.map((item) => (
            <ListItem key={item.id} type={type} item={item} />
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

export default memo(GroupsTable)
