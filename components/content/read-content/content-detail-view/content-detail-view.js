import './content-detail-view.scss'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import CommentForm from '../../../comments/comment-form/comment-form'
import { usePermission } from '../../../../lib/hooks'

export default function (props) {
  const lockReadComments = usePermission(
    `content.${props.type.slug}.comments.read`
  )
  const lockWriteComments = usePermission(
    `content.${props.type.slug}.comments.write`
  )

  return (
    <div className="content-detail-view">
      <div className="content-detail-content">
        {props.type.fields.map((field) => {
          return (
            <div className="field">
              {field.name} : {props.content[field.name]}
            </div>
          )
        })}
      </div>

      {props.type.comments.enabled && !lockWriteComments && (
        <CommentForm type={props.type} contentId={props.content.id} />
      )}

      {props.type.comments.enabled && !lockReadComments && (
        <CommentsFeed type={props.type} contentId={props.content.id} />
      )}
    </div>
  )
}
