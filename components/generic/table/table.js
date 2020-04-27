export function TableCell({ children, ...props }) {
  return (
    <>
      <div className="column" {...props}>
        {children}
      </div>
      <style jsx>{`
        .column {
          padding: var(--empz-gap);
          border: var(--light-border);

          flex-basis: 100%;
          flex: 1 1 0px;
        }
      `}</style>
    </>
  )
}

export function TableRow({ children, ...props }) {
  return (
    <>
      <div className="row" {...props}>
        {children}
      </div>
      <style jsx>{`
        .row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      `}</style>
    </>
  )
}

export default function (props) {
  return (
    <>
      <div className="table">
        <div className="table-header">
          <TableRow>{props.headerCells}</TableRow>
        </div>
        <div className="header-body">{props.children}</div>
      </div>
      <style jsx>{`
        .table {
          background: var(--empz-background);
        }

        .table-header {
          font-weight: bold;
          background: var(--empz-secondary);
          color: var(--empz-foreground);
          border: var(--light-border);
        }
      `}</style>
    </>
  )
}
