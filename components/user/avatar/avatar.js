export default function(props) {
  const src = props.src || "https://api.adorable.io/avatars/125/abott@adorable.png"
  const title = props.title || "Avatar"
  const width = props.width || 100;
  const margin = props.margin || 5;

  return (
    <>
    <div className="avatar">
      <img title={title} src={src} ></img>
    </div>
    <style jsx>{
      `
      img {
        border-radius: 100%;
        overflow: hidden;
        width: 100%;
      }
      
      .avatar {
        margin: ${margin}px;
        width: ${width}px;
      }
      `
    }</style>
  </>)
}