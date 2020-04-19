import API from '../../../lib/api/api-endpoints'
import CommentItem from '../comment-item/comment-item'
import fetch from '../../../lib/fetcher'
import useSWR from 'swr'

export default function (props) {
  const { data } = useSWR(
    `${API.comments[props.type.slug]}/${props.contentId}`,
    fetch
  )

  return (
    <div className="comments-feed">
      {(data ? data.results : []).map((comment) => {
        return <CommentItem key={comment.id} comment={comment} />
      })}
    </div>
  )
}
