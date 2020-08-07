import React, { useState, memo } from 'react'
import useSWR, { useSWRPages } from 'swr'

import Table, { TableCellHeader } from '@components/generic/table/table'
import { GroupTypeDefinition } from '@lib/types/groupTypeDefinition'
import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import fetch from '@lib/fetcher'

import ListItem from './list-item'
import Placeholder from './placeholder'

interface Props {
  type: GroupTypeDefinition
}

function GroupsTable({ type }: Props) {
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<string>('DESC')

  // Fetch groups page by page
  const {
    pages,
    isLoadingMore,
    loadMore,
    isEmpty,
    isReachingEnd,
  } = useSWRPages(
    `admin-groups-${type.slug}-list`,
    ({ offset, withSWR }) => {
      const apiUrl = `${API.groups[type.slug]}?limit=10${
        offset ? '&from=' + offset : ''
      }&sortBy=${sortBy}&sortOrder=${sortOrder}`
      const { data } = withSWR(useSWR(apiUrl, fetch))

      if (!data) return <Placeholder />

      const { results } = data

      return results.map((item) => (
        <ListItem key={item.id} type={type} item={item} />
      ))
    },
    (SWR) => {
      // Calculates the next page offset
      return SWR.data && SWR.data.results && SWR.data.results.length >= 10
        ? SWR.data.from * 1 + SWR.data.limit * 1
        : null
    },
    [sortOrder]
  )

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
          {pages}
          {isEmpty && <div className="empty">Sorry, no items found.</div>}
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

export default memo(GroupsTable)
