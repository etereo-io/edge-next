import CommentForm from '../../../comments/comment-form/comment-form'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import ContentActions from '../../content-actions/content-actions'
import styles from './content-detail-view.module.scss'
import { usePermission } from '../../../../lib/hooks'

export default function (props) {
  const canReadComments = usePermission(
    `content.${props.type.slug}.comments.read`
  )
  const canWriteComments = usePermission(
    `content.${props.type.slug}.comments.write`
  )

  return (
    <div className={styles.contentDetailView}>
      <div className={styles['content-detail-wrapper']}>
        <div className={styles['content-detail-content']}>
          {props.type.fields.map((field) => {
            return (
              <div className={styles.field}>
                <div className={styles.label}>{field.name}</div>
                <div className="value">
                  {props.content[field.name]}
                </div>
              </div>
            )
          })}
        </div>

        <ContentActions className={styles['content-actions']} content={props.content} />

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
