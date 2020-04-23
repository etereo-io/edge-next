export default function(props) {
  const src = props.src || "https://api.adorable.io/avatars/125/abott@adorable.png"
  const title = props.title || "Avatar"
  const width = props.width || 100;
  const margin = props.margin || 5;

  return (
    <>
    <div className="avatar">
      {!props.loading && <img title={title} src={src} ></img>}
      {props.loading && <span className="empty-avatar"></span>}
    </div>
    <style jsx>{
      `
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
        margin: ${margin}px;
        width: ${width}px;
      }
      `
    }</style>
  </>)
}