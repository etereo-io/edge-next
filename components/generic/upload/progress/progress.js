export default function Named(props) {
  return (
    <>
      <div className="progress-bar">
        <div className="progress" style={{ width: props.progress + '%' }} />
      </div>
      <style jsx>{`
        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: rgb(183, 155, 229);
          border-radius: 5px;
        }

        .progress {
          background-color: rgba(103, 58, 183, 1);
          height: 100%;
          margin: 0;
          border-radius: 5px;
        }
      `}</style>
    </>
  )
}
