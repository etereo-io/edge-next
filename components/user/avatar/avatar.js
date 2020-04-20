export default function(props) {
  return (
    <>
    <div className="avatar">
      <img title="Avatar" src="https://api.adorable.io/avatars/125/abott@adorable.png"></img>
    </div>
    <style jsx>{
      `
      img {
        border-radius: 100%;
        overflow: hidden;
        width: 100%;
      }
      
      .avatar {
        padding: 5px;
      }
      `
    }</style>
  </>)
}