import CommentItem from '../comment-item/comment-item'


import useSWR from 'swr'
import fetch from '../../../lib/fetcher'
import API from '../../../lib/api/api-endpoints'

export default function(props) {
 

  const { data } = useSWR(`${API.comments[props.type.slug]}/${props.contentId}`, fetch)
  
  return (
    <div className="comments-feed">
      
      {(data || []).map(comment => {
        return <CommentItem comment={comment} />
      })}
    </div>
  )
}