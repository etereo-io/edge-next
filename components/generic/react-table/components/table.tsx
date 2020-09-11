import React, { useMemo, memo, useEffect, Fragment } from 'react'
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
  Column,
  HeaderGroup,
} from 'react-table'

import LoadingPlaceholder from '@components/generic/loading/loading-placeholder/loading-placeholder'
import { usePrevious } from '@lib/client/hooks'

interface TableSortObject {
  id: string
  desc: boolean
}

export type ExtendedColumn<T extends object = {}> = Column<T> & {
  className?: string
  headerClassName?: string
  sortable?: boolean
  justifyContent?: string
  headerAlign?: string
}

interface ExtendedHeader<T extends object = {}> extends HeaderGroup<T> {
  sortable?: boolean
  headerClassName?: string
  justifyContent?: string
}

interface Props<T extends object = {}> {
  columns: Column<T>[]
  data: T[]
  fetchData?: (params: any) => void
  loading?: boolean
  isSort?: boolean
  isEmpty?: boolean
  isReachingEnd?: boolean
  limit?: number
  initialState?: any
}

const headerProps = (props, { column }) =>
  getStyles(props, column.justifyContent, column.headerAlign)

const cellProps = (props, { cell }) =>
  getStyles(props, cell.column.justifyContent)

const getStyles = (
  props,
  justifyContent = 'flex-start',
  textAlign = 'left'
) => [
  props,
  {
    style: {
      justifyContent,
      textAlign,
      alignItems: 'flex-start',
      display: 'flex',
      ...props,
    },
  },
]

function ReactTable<T extends object = {}>({
  columns = [],
  data = [],
  fetchData = () => {},
  initialState,
  loading = false,
  isEmpty,
  limit,
}: Props<T>) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      className: '',
    }),
    []
  )

  const prevData = usePrevious(data)

  const records = []

  if (loading && prevData) {
    records.push(...(Array.isArray(prevData) ? prevData : []))
  } else {
    records.push(...data)
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable<T>(
    {
      columns,
      data: records,
      initialState,
      defaultColumn,
      defaultCanSort: true,
      disableMultiSort: true,
      manualSortBy: true,
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy
  )

  const sort = useMemo(() => {
    return sortBy.map((sortObj: TableSortObject) => ({
      field: sortObj.id,
      order: sortObj.desc ? 'DESC' : 'ASC',
    }))
  }, [sortBy])

  useEffect(() => {
    fetchData(sort)
  }, [sort])

  return (
    <>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column: ExtendedHeader<T>) => (
                <div
                  {...column.getHeaderProps(headerProps)}
                  className={`th ${column.headerClassName || ''}`}
                >
                  <div
                    {...column.getHeaderProps(
                      column.sortable ? column.getSortByToggleProps() : {}
                    )}
                  >
                    {column.render('Header')}
                  </div>
                  <span className="sort-icon">
                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                  </span>
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? 'isResizing' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className="tbody">
          {rows.map((row, i) => {
            prepareRow(row)

            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  const column: ExtendedColumn<T> = cell.column

                  return (
                    <div
                      {...cell.getCellProps(cellProps)}
                      className={`${column.className || ''} td`}
                    >
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
          {loading &&
            Array.from({ length: limit }).map((value, index) => (
              <div key={index} className="tr">
                <LoadingPlaceholder width="100%" />
              </div>
            ))}
        </div>
        {isEmpty && <div className="empty">Sorry, no items found.</div>}
      </div>
      <style jsx>
        {`
          .table {
            background: var(--accents-1-medium);
            display: block;
            font-size: 12px;
          }

          .sort-icon  {
            font-size: 14px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 16px;
          }

          .table .tr {
            align-items: center;
            background: var(--edge-background);
            border: none;
            border-radius: 8px;
            transition: 0.3s ease;
            margin: 8px 0;
            width: 100%;
          }

          .table .tr:first-of-type {
            margin-top: 0;
          }

          .tr:hover {
            background: var(--edge-background);
          }

          .table .thead {
            background: var(--accents-2);
            z-index: var(--z-index-minimum);
            overflow-y: auto;
            overflow-x: hidden;
          }

          .table .tbody {
            overflow-y: auto;
            overflow-x: hidden;
          }

          .table .tbody .td:first-of-type {
            align-items: center !important;
            color: var(--accents-7);
            font-weight: 600;
          }

          .user-avatar  {
            margin-right: 4px;
          }

          .table .tbody .td .avatar {
            margin-right: 4px;
          }

          .table .td {
            color: var(--accents-5);
            overflow: hidden;
            padding: 16px;
            position: relative;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .table .td:last-of-type {
            overflow: visible;
          }

          div[role='columnheader'] {
            background: var(--accents-2);
            color: var(--accents-4);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 8px;
          }

          div[role='columnheader']:first-of-type {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            overflow: hidden;
          }

          div[role='columnheader']:last-of-type {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            overflow: hidden;
          }

          .resizer {
            display: inline-block;
            word-wrap: break-word;
            background: var(--accents-4);
            opacity: 0.2;
            width: 1px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            transform: translateX(50%);
            z-index: 1;
            touch-action: none;
          }

          .resizer:hover {
            opacity: 1;
          }

          .th {
            padding: var(--edge-gap-half);
            position: sticky;
            text-align: left;
            top: 0;
          }

          .loading {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
            display: block;
            opacity: 0.7;
            background: linear-gradient(
              -45deg,
              var(--accents-1),
              var(--accents-2),
              var(--accents-1),
              var(--accents-2)
            );
            z-index: 99;
            text-align: center;
          }
        `}
      </style>
    </>
  )
}

export default memo(ReactTable)
