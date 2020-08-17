export function TableCellHeader({ children, ...props }) {
  return (
    <>
      <th scope="col" {...props}>
        <span className="table-header">{children}</span>
      </th>
      <style jsx>{`
        th {
          background: var(--accents-2);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: var(--edge-gap-half);
          position: sticky;
          text-align: left;
          top: 0;
        }
        
        .center {
          text-align: center
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
          border-bottom: 1px solid var(--accents-2);
          padding: var(--edge-gap-half);
          white-space: nowrap;
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

export default function Named(props) {
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
          border-spacing: 0;
          font-size: 14px;
          width: 100%;
        }

        table tr {
          border: none;
          height: var(--cds-layout-04, 3rem);
          transition: 0.3s ease;
          width: 100%;
        }

        table thead {
          background: var(--accents-2);
          z-index: var(--z-index-minimum);
        }
      `}</style>
    </>
  )
}
