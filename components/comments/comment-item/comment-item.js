import styles from  './comment-item.module.scss'
export default function (props) {
  
  return (
    <div className={styles.commentItem}>
      <div className="posted-on">Posted on: {props.comment.createdAt}</div>
      <div className="from">Posted by: {props.comment.author}</div>
      <p>{props.comment.message}</p>
    </div>
  )
}
