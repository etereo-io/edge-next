import CommentForm from '../../../comments/comment-form/comment-form'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import ContentActions from '../../content-actions/content-actions'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import { usePermission } from '@lib/client/hooks'
import { useState } from 'react'
import { useMonetizationState } from 'react-web-monetization'
import Link from 'next/link'
import Button from '@components/generic/button/button'

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

  const contentIsMonetized = props.content.paymentPointer && props.type.monetization && props.type.monetization.web
  const monetizedState = contentIsMonetized && !props.summary ? useMonetizationState() : null

  return (
    <>
      <div>
        <div className={'content-detail-wrapper'}>
          <div className={'content-detail-content'}>
            {contentIsMonetized && props.summary && <div className="monetization-layer">
              <div className="monetization-layer-content">
                <p>This content is monetized, to see the full content please navigate to the detail.</p>

                <Button href={`/content/${props.type.slug}/${props.content.slug}`}>See full content</Button>
              </div>    
            </div>}

            {contentIsMonetized && !props.summary && !monetizedState.state && <div className="monetization-layer">
              <div className="monetization-layer-content">
                This content is monetized, to see the full content please, sign up for Coil to support the author
              </div>    
            </div>}

            {contentIsMonetized && !props.summary && monetizedState.state === 'started' && <div className="monetization-layer">
              <p>Thanks for supporting this author</p>  
            </div>}

            <ContentSummaryView
              content={props.content}
              summary={!!props.summary}
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
                    onCancel={() => setShowComments(!showComments)}
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
          position: relative;
          flex: 1;

          box-shadow: var(--shadow-smallest);
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
          margin: var(--empz-gap-half) 0 var(--empz-gap);
        }

        .monetization-layer {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: white;
          padding: var(--empz-gap);
          z-index: var(--z-index-cover-content);
          background: linear-gradient(180deg, rgba(255,255,255,0) 0, var(--empz-background) 30%);
        }

        .monetization-layer-content {
          width: 60%;
          margin: 0 auto;
          padding-top: 20%;
          font-weight: bold;
          text-align: center;
        }

        .monetization-layer-content p {
          margin-bottom: var(--empz-gap-half);
        }
      `}</style>
    </>
  )
}
