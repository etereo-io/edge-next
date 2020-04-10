import CommentItem from '../comment-item/comment-item'

export default function() {
  const comments = [{
    from: 'a',
    message: 'Hugh, this is great!!',
    date: new Date() - 1000
  }, {
    from: 'a',
    message: 'Hugh, this is great!!',
    date: new Date() - 1000
  }]

  return (
    <div className="comments-feed">
      
      {comments.map(comment => {
        return <CommentItem comment={comment} />
      })}
    </div>
  )
}