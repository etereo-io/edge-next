import './comment-item.scss'
export default function (props) {
  console.log('joder', props)
  return (
    <div className="comment-item">
      <div className="posted-on">Posted on: {props.comment.createdAt}</div>
      <div className="from">Posted by: {props.comment.author}</div>
      <p>{props.comment.message}</p>
    </div>
  )
}
