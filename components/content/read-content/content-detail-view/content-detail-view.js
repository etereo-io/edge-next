import CommentForm from '../../../comments/comment-form/comment-form'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import ContentActions from '../../content-actions/content-actions'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import { usePermission } from '../../../../lib/hooks'
import { useState } from 'react'

export default function (props) {
  
  const canReadComments = usePermission(
    [`content.${props.type.slug}.comments.read`]
  )
  const canWriteComments = usePermission(
    [`content.${props.type.slug}.comments.create`]
  )

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

        {props.type.comments.enabled && canWriteComments.available && (
          <div className="comment-form-wrapper"><CommentForm onSave={onCommentAdded} type={props.type} contentId={props.content.id} /></div>
        )}
  
        {props.type.comments.enabled && canReadComments.available && (
          <CommentsFeed type={props.type} contentId={props.content.id} newComments={newComments} />
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

        .comment-form-wrapper {
          margin-bottom: var(--empz-gap);
        }
      `}</style>
    </>
  )
}
