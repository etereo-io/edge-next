import CommentForm from '../../../comments/comment-form/comment-form'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import ContentActions from '../../content-actions/content-actions'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import { usePermission } from '../../../../lib/client/hooks'
import { useState } from 'react'

export default function (props) {
  const [showComments, setShowComments] = useState(!!props.showComments)

  const canReadComments = usePermission([
    `content.${props.type.slug}.comments.read`,
    `content.${props.type.slug}.comments.admin`,
  ])

  const canWriteComments = usePermission([
    `content.${props.type.slug}.comments.create`,
    `content.${props.type.slug}.comments.admin`,
  ])

  // Display new comments on top of feed
  const [newComments, setNewComments] = useState([])
  const onCommentAdded = (c) => {
    setNewComments([c, ...newComments])
  }

  return (
    <>
      <div>
        <div className={'content-detail-wrapper'}>
          <div className={'content-detail-content'}>
            <ContentSummaryView
              content={props.content}
              links={!!props.links}
              type={props.type}
              canReadComments={canReadComments.available}
              canWriteComments={canWriteComments.available}
              onClickComments={() => setShowComments(!showComments)}
            />

            {props.type.comments.enabled &&
              canWriteComments.available &&
              showComments && (
                <div className="comment-form-wrapper">
                  <CommentForm
                    onSave={onCommentAdded}
                    type={props.type}
                    contentId={props.content.id}
                  />
                </div>
              )}

            {props.type.comments.enabled &&
              canReadComments.available &&
              showComments && (
                <CommentsFeed
                  type={props.type}
                  contentId={props.content.id}
                  newComments={newComments}
                />
              )}
          </div>

          {props.showActions && (
            <ContentActions
              className={'content-actions'}
              content={props.content}
            />
          )}
        </div>
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
          margin-bottom: var(--empz-gap-double);
          flex: 1;
          

          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          color: var(--empz-foreground);
          background: var(--empz-background);
          padding: var(--empz-gap);
          border-radius: var(--empz-radius);
          margin: 0 auto;
          width: 100%;
        }

        .label {
          font-weight: bold;
        }

        .field {
          margin-bottom: var(--empz-gap);
        }

        .comment-form-wrapper {
          margin-bottom: var(--empz-gap);
        }
      `}</style>
    </>
  )
}
