import CommentForm from '../../../comments/comment-form/comment-form'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import ContentActions from '../../content-actions/content-actions'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import { usePermission } from '../../../../lib/hooks'

export default function (props) {
  const canReadComments = usePermission(
    `content.${props.type.slug}.comments.read`
  )
  const canWriteComments = usePermission(
    `content.${props.type.slug}.comments.create`
  )

  return (
    <>
      <div>
        <div className={'content-detail-wrapper'}>
          <div className={'content-detail-content'}>
            <ContentSummaryView
              content={props.content}
              links={false}
              type={props.type}
            />
            {/*<UserBlock title="Author" user={author} />*/}
          </div>

          <ContentActions
            className={'content-actions'}
            content={props.content}
          />
        </div>

        {props.type.comments.enabled && canWriteComments && (
          <CommentForm type={props.type} contentId={props.content.id} />
        )}

        {props.type.comments.enabled && canReadComments && (
          <CommentsFeed type={props.type} contentId={props.content.id} />
        )}
      </div>
      <style jsx>{`
        .content-detail-wrapper {
          display: flex;
        }
        .content-actions {
          padding: var(--empz-gap);
          max-width: 200px;
        }

        .content-detail-content {
          background: var(--empz-background);
          padding: var(--empz-gap);
          margin-bottom: var(--empz-gap-double);
          flex: 1;
        }

        .label {
          font-weight: bold;
        }

        .field {
          margin-bottom: var(--empz-gap);
        }
      `}</style>
    </>
  )
}
