import React, { Fragment, memo, useState } from 'react'
import config, { getInteractionsDefinition } from '@lib/config'

import AuthorBox from '@components/user/author-box/author-box'
import Button from '@components/generic/button/button'
import CommentForm from '../../../comments/comment-form/comment-form'
import CommentsFeed from '../../../comments/comments-feed/comments-feed'
import ContentActions from '../../content-actions/content-actions'
import { ContentEntityType } from '@lib/types'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import { Interaction } from '@components/generic/interactions'
import PurchasingProductForm from '../purchasing-product-form'
import SocialShare from '@components/generic/social-share/social-share'
import { format } from 'timeago.js'
import { purchasingPermission } from '@lib/permissions'
import { useMonetizationState } from 'react-web-monetization'
import { usePermission } from '@lib/client/hooks'
import { useUser } from '@lib/client/hooks'

interface Props {
  content: ContentEntityType
  type: ContentTypeDefinition
  summary?: boolean
  showActions?: boolean
  showComments?: boolean
  addComments?: boolean
}

function ContentDetailView(props: Props) {
  const { addComments = true } = props

  const interactionsConfig = getInteractionsDefinition(
    'content',
    props.type.slug
  )

  const shareUrl =
    typeof window !== 'undefined'
      ? `${String(window.location)}/content/${props.type.slug}/${
          props.content.seo.slug
        }`
      : ''
  const [showComments, setShowComments] = useState(!!props.showComments)

  const canReadComments = usePermission([
    `content.${props.type.slug}.comments.read`,
    `content.${props.type.slug}.comments.admin`,
  ])

  const canWriteComments = usePermission([
    `content.${props.type.slug}.comments.create`,
    `content.${props.type.slug}.comments.admin`,
  ])

  const { user } = useUser()

  const canEditComment = usePermission([
    `content.${props.content.type}.admin`,
    `content.${props.content.type}.update`,
  ])

  const isContentOwner = user && user.id === props.content.author

  // Display new comments on top of feed
  const [newComments, setNewComments] = useState([])
  const onCommentAdded = (c) => {
    setNewComments([c, ...newComments])
  }

  const contentIsMonetized =
    props.content.paymentPointer &&
    props.type.monetization &&
    props.type.monetization.web
  const monetizedState =
    contentIsMonetized && !props.summary ? useMonetizationState() : null

  const onClickComments = (ev) => {
    if (
      (canReadComments.available && props.content.comments) ||
      canWriteComments.available
    ) {
      setShowComments(true)
    }
  }


  return (
    <>
      <article className="edge-item-card">
        <div className="content-wrapper">

          {contentIsMonetized && props.summary && (
            <div className="monetization-layer">
              <div className="monetization-layer-content">
                <p>
                  This content is monetized, to see the full content please
                  navigate to the detail.
                </p>

                <Button
                  href={`/content/${props.type.slug}/${props.content.seo.slug}`}
                >
                  See full content
                </Button>
              </div>
            </div>
          )}

          {contentIsMonetized && !props.summary && !monetizedState.state && (
            <div className="monetization-layer">
              <div className="monetization-layer-content">
                This content is monetized, to see the full content please, sign up
                for Coil to support the author
              </div>
            </div>
          )}

          {contentIsMonetized &&
            !props.summary &&
            monetizedState.state === 'started' && (
              <div className="monetization-layer">
                <p>Thanks for supporting this author</p>
              </div>
            )}

          <div className="edge-item-card-header">
            {props.content.draft && <div className="status">Draft</div>}

            {!props.content.draft && (
              <div className="author-info">
                <AuthorBox user={props.content ? props.content.user : null} />
              </div>
            )}

            <div className="edge-item-card-actions">
              {(canEditComment.available || isContentOwner) && (
                <div className="header-item-action">
                  <Button
                    href={`/edit/content/${props.content.type}/${props.content.seo.slug}`}
                    round
                    aria-label="round button"
                  >
                    <img
                      style={{ width: '15px' }}
                      src="/icons/icon-edit.svg"
                      alt="edit"
                    />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="edge-item-card-content">
            <ContentSummaryView
              content={props.content}
              summary={!!props.summary}
              type={props.type}
              user={user}
            />
          </div>
                

          <footer className="edge-item-card-footer">
            <ul className="edge-item-card-stats">
              <li className="edge-item-card-stats-item">
                <b>{format(props.content.createdAt)}</b>
              </li>

              <li className="edge-item-card-stats-item">
                <b>
                  {props.type.comments.enabled &&
                  canReadComments.available &&
                  typeof props.content.comments !== 'undefined' &&
                  addComments ? (
                    <span className="comment-count" onClick={onClickComments}>
                      {props.content.comments === 0 && canWriteComments.available
                        ? 'Add a comment'
                        : `${props.content.comments} comments`}
                    </span>
                  ) : null}
                </b>
              </li>
            </ul>

            <SocialShare shareUrl={shareUrl} />
          </footer>

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
          <div className="interactions">
            {interactionsConfig.map((interaction) => (
              <Interaction
                key={interaction.type}
                interactions={props.content.interactions}
                interactionConfig={interaction}
                entity="content"
                entityType={props.type.slug}
                entityId={props.content.id}
              />
            ))}
          </div>
          {props.type.comments.enabled &&
            canReadComments.available &&
            showComments && (
              <CommentsFeed
                type={props.type}
                contentId={props.content.id}
                newComments={newComments}
              />
            )}

          {props.showActions && (
            <ContentActions
              className={'content-actions'}
              content={props.content}
            />
          )}
        </div>

        {purchasingPermission(user, 'buy', props.type.slug) && props.content.purchasingOptions &&  (
          <div className="purchasing-options-wrapper">
            <PurchasingProductForm value={props.content.purchasingOptions} />
          </div>
        ) }

      </article>
      <style jsx>{`
        
        .edge-item-card {
          background-color: var(--edge-background);
          border-radius: var(--edge-gap-half);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: var(--edge-gap);
          position: relative;
          display: flex;
          flex-wrap: wrap;
        }

        .content-wrapper {
          padding: var(--edge-gap-medium);
        }

        .purchasing-options-wrapper {
          padding: var(--edge-gap-medium);
        }

        .comment-count{
          cursor: pointer;
        }

        .interactions {
          margin-top: var(--edge-gap);
          display: inline-flex;
          justify-content: center;
          align-content: center;
          align-items: center;
        }

        .edge-item-card-footer {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .edge-item-card-stats {
          display: flex;
        }

        .edge-item-card-stats-item {
          font-size: 13px;
          list-style: none;
          margin-right: var(--edge-gap);
        }


        @media all and (max-width: 720px) {
          .edge-item-card-footer {
            display: flex;
            flex-flow: column;
          }

          .edge-item-card-stats {
            margin-bottom: var(--edge-gap);
          }

          .edge-item-card-stats-item {
            display: flex;
            flex-flow: column;
            font-size: 12px;
          }

          .edge-item-card-stats-item:last-of-type {
            margin-right: 0;
          }
        }

        .edge-item-card-stats-item b {
          margin-right: var(--edge-gap-half);
        }

        .edge-item-card-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .edge-item-card-actions {
          align-items: center;
          display: flex;
        }

        .edge-item-card-actions .header-item-action {
          margin-left: var(--edge-gap-half);
        }

        .edge-item-card-content {
          margin: var(--edge-gap-double) 0 0;
        }

        .content-summary-content {
          padding-right: var(--edge-gap-double);
        }

        @media all and (max-width: 720px) {
          .content-summary-content {
            padding-right: 0;
          }
        }

        .status {
          background: var(--accents-2);
          border-radius: 4px;
          color: var(--edge-foreground);
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          padding: 4px 8px;
          text-align: center;
          text-transform: uppercase;
          width: fit-content;
        }

        .content-actions {
          padding: var(--edge-gap);
          max-width: 200px;
        }

        .comment-form-wrapper {
          margin: var(--edge-gap-half) 0 var(--edge-gap);
        }

        .monetization-layer {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: white;
          padding: var(--edge-gap);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0,
            var(--edge-background) 30%
          );
        }

        .monetization-layer-content {
          width: 60%;
          margin: 0 auto;
          font-weight: bold;
          text-align: center;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .monetization-layer-content p {
          margin-bottom: var(--edge-gap-half);
        }
      `}</style>
    </>
  )
}

export default memo(ContentDetailView)
