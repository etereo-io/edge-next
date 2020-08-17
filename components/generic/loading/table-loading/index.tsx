import { memo } from 'react'

import { TableCellBody, TableRowBody } from '@components/generic/table/table'
import LoadingPlaceholder from '@components/generic/loading/loading-placeholder/loading-placeholder'

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

export default memo(Placeholder)
