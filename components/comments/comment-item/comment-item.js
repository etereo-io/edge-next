import './comment-item.scss'
export default function (props) {
  console.log('joder', props)
  return (
    <div className="comment-item">
      <div className="from">{props.comment.from}</div>
      <p>{props.comment.message}</p>
    </div>
  )
}
