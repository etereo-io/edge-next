
export default function (props) {
  return (
    <>
    <div className='commentItem'>
      <div className="posted-on">Posted on: {props.comment.createdAt}</div>
      <div className="from">Posted by: {props.comment.author}</div>
      <p>{props.comment.message}</p>
    </div>
    <style jsx>
      {
        `
        .commentItem {
          padding: var(--empz-gap);
          border: var(--light-border);
        }
        `
      }
    </style>
    </>
  )
}
