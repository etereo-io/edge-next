import { memo } from 'react'

export function TableCellHeader({ children, ...props }) {
  return (
    <>
      <th scope="col" {...props}>
        <span className="table-header">{children}</span>
      </th>
      <style jsx>{`
        th {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: var(--edge-gap-half);
          position: sticky;
          text-align: left;
          top: 0;
        }

        .center {
          text-align: center;
        }
      `}</style>
    </>
  )
}

export function TableCellBody({ children, ...props }) {
  return (
    <>
      <td {...props}>{children}</td>
      <style jsx>{`
        td {
          border-top: 1px solid var(--accents-2);
          border-bottom: 1px solid var(--accents-2);
          padding: 16px 8px;
          max-width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        td:last-of-type{
          max-width: none;
        }

        td:first-of-type{
          border-left: 1px solid var(--accents-2);
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        td:last-of-type{
          border-right: 1px solid var(--accents-2);
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      `}</style>
    </>
  )
}

export function TableRow({ children, ...props }) {
  return <>{children}</>
}

export function TableRowBody({ children, ...props }) {
  return (
    <>
      <tr>{children}</tr>
      <style jsx>{`
        tr {
          border: none;
          height: var(--cds-layout-04, 3rem);
          transition: 0.3s ease;
          width: 100%;
        }
        tr:hover {
          background: var(--accents-2);
        }
      `}</style>
    </>
  )
}

function Table(props) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <TableRow>{props.headerCells}</TableRow>
          </tr>
        </thead>
        <tbody aria-live="polite">
          <TableRow>{props.children}</TableRow>
        </tbody>
      </table>
      <style jsx>{`
        table {
          border-collapse: collapse;
          font-size: 14px;
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        table tr {
          border: none;
          height: var(--cds-layout-04, 3rem);
          transition: 0.3s ease;
          width: 100%;
        }

        table thead {
          background: var(--accents-1);
          z-index: var(--z-index-minimum);
        }
      `}</style>
    </>
  )
}

export default memo(Table)
