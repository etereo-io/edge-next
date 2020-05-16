export default function (props) {
  const src = props.src || '/static/demo-images/default-avatar.jpg'
  const title = props.title || 'Avatar'
  const width = props.width || 100
  const margin = props.margin || 5

  return (
    <>
      <div className="avatar">
        {!props.loading && <img title={title} src={src}></img>}
        {props.loading && (
          <div className="empty-avatar">
            {' '}
            <img src="/static/demo-images/loading-avatar.gif" />
          </div>
        )}
      </div>
      <style jsx>{`
        img {
          border-radius: 100%;
          overflow: hidden;
          width: 100%;
        }

        .empty-avatar {
          width: 100%;
          height: ${width}px;
          border: var(--light-border);
          display: block;
          border-radius: 100%;
        }

        .avatar {
          display: inline-block;
          margin: ${margin}px;
          height: ${width}px;
          vertical-align: middle;
          width: ${width}px;
        }

        .avatar img{
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      `}</style>
    </>
  )
}
