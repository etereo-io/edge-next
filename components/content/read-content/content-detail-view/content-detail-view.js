import './content-detail-view.module.scss'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import CommentForm from '../../../comments/comment-form/comment-form'
import ContentActions from '../../content-actions/content-actions'

import { usePermission } from '../../../../lib/hooks'

export default function (props) {
  const canReadComments = usePermission(
    `content.${props.type.slug}.comments.read`
  )
  const canWriteComments = usePermission(
    `content.${props.type.slug}.comments.write`
  )

  return (
    <div className="content-detail-view">
      <div className="content-detail-wrapper">
        <div className="content-detail-content">
          {props.type.fields.map((field) => {
            return (
              <div className="field">
                <div className="label">{field.name}</div>
                <div className="value">
                  {props.content[field.name]}
                </div>
              </div>
            )
          })}
        </div>

        <ContentActions content={props.content} />

      </div>

      {props.type.comments.enabled && canWriteComments && (
        <CommentForm type={props.type} contentId={props.content.id} />
      )}

      {props.type.comments.enabled && canReadComments && (
        <CommentsFeed type={props.type} contentId={props.content.id} />
      )}
    </div>
  )
}
