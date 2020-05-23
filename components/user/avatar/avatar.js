export default function (props) {
  const defaultSrc = '/static/demo-images/default-avatar.jpg'
  const title = props.title || 'Avatar'
  const width = props.width || 100

  return (
    <>
      <div className={`avatar ${props.className}`}>
        {!props.loading && (
          <img title={title} src={props.src || defaultSrc}></img>
        )}
        {props.loading && (
          <div className="empty-avatar">
            <img src="/static/demo-images/loading-avatar.gif" />
          </div>
        )}
      </div>
      <style jsx>{`
        img {
          border-radius: 15%;
          overflow: hidden;
          width: 100%;
        }

        .empty-avatar {
          width: 100%;
          height: 100%;
          border: var(--light-border);
          display: block;
          border-radius: 8px;
        }

        .avatar {
          border-radius: 15%;
          display: inline-block;
          height: ${width}px;
          max-height: 80px;
          max-width: 80px;
          vertical-align: middle;
          width: ${width}px;
        }

        .avatar img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      `}</style>
    </>
  )
}
