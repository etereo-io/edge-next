import { useState } from 'react'
import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'
import Button from '../../generic/button/button'
import Placeholder from '../../generic/loading/loading-placeholder/loading-placeholder'
import CommentEntry from '../comment-entry/comment-entry'

function LoadingItems() {
  return (
    <>
      <div className="placeholders">
        <div className="p">
          <div className="a">
            <Placeholder width={'40px'} height={'40px'} borderRadius={'100%'} />
          </div>
          <div className="d">
            <div className="r">
              <Placeholder width={'100%'} height={'10px'} />
            </div>
            <div className="r">
              <Placeholder width={'100%'} height={'40px'} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .p {
          background: var(--edge-background);
          padding: var(--edge-gap-half);
          margin-bottom: var(--edge-gap-half);
          border-radius: var(--edge-radius);
          display: flex;
        }

        .d {
          flex: 1;
          padding-left: var(--edge-gap-half);
        }
        .r {
          margin-bottom: var(--edge-gap-half);
        }
      `}</style>
    </>
  )
}

export default function ({
  contentId = '',
  type = {},
  comment = {},
  onConversationDeleted = () => {},
}) {
  // Conversation ID
  const conversationId = comment.id

  // Replies feed
  const [showRepliesFeed, setShowRepliesFeed] = useState(false)

  // Display new comments on top of feed
  const [newReplies, setNewReplies] = useState([])

  // Store the list of deleted items to hide them from UI without reloading the data
  const [deletedCommentsIds, setDeletedCommentsIds] = useState([])

  const onCommentAdded = (c) => {
    if (setShowRepliesFeed === false) {
      // First reply added, no need to "fake" the new added comment
      setShowRepliesFeed(true)
    } else {
      setNewReplies([...newReplies, c])
    }
  }

  // A reply is deleted
  const onCommentDeleted = (c) => {
    setDeletedCommentsIds([...deletedCommentsIds, c.id])
  }

  // The main conversation comment is deleted
  const onMainCommentDeleted = (c) => {
    onConversationDeleted(c)
  }

  // Load the conversation items
  const [from, setFrom] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [replies, setReplies] = useState([])
  const [isReachingEnd, setIsReachingEnd] = useState(false)
  const itemsPerPage = 10

  const loadReplies = async () => {
    const apiUrl = `${
      API.comments
    }?contentType=${type.slug}&contentId=${contentId}&limit=${itemsPerPage}${
      from ? '&from=' + from : ''
    }&conversationId=${conversationId}`

    try {
      setIsLoadingMore(true)
      const { results } = await fetch(apiUrl)

      setReplies([...replies, ...results])
      setIsLoadingMore(false)

      if (results.length < itemsPerPage) {
        setIsReachingEnd(true)
      } else {
        setFrom(from + itemsPerPage)
      }
    } catch (err) {
      setIsLoadingMore(false)
      setIsReachingEnd(true)
    }
  }

  const onClickShowReplies = () => {
    setShowRepliesFeed(true)
    loadReplies()
  }

  return (
    <>
      <div className={`comment-item`}>
        <CommentEntry
          comment={comment}
          contentId={contentId}
          conversationId={conversationId}
          type={type}
          onCommentAdded={onCommentAdded}
          onCommentDeleted={onMainCommentDeleted}
        />
        {comment.replies && !showRepliesFeed ? (
          <div className="collapsed-comment" onClick={onClickShowReplies}>
            <a>View {comment.replies} replies</a>
          </div>
        ) : null}

        <div className={`replies`}>
          {newReplies
            .filter((item) => deletedCommentsIds.indexOf(item.id) === -1)
            .map((item) => {
              return (
                <div key={item.id} className={`reply`}>
                  <CommentEntry
                    comment={item}
                    contentId={contentId}
                    conversationId={conversationId}
                    type={type}
                    onCommentAdded={onCommentAdded}
                    onCommentDeleted={onCommentDeleted}
                  />
                </div>
              )
            })}

          {showRepliesFeed &&
            replies
              .filter((item) => deletedCommentsIds.indexOf(item.id) === -1)
              .map((item) => {
                return (
                  <div key={item.id} className={`reply`}>
                    <CommentEntry
                      comment={item}
                      contentId={contentId}
                      conversationId={conversationId}
                      type={type}
                      onCommentAdded={onCommentAdded}
                      onCommentDeleted={onCommentDeleted}
                    />
                  </div>
                )
              })}

          {isLoadingMore && <LoadingItems />}
        </div>
        <div className="load-more">
          {showRepliesFeed && replies.length >= itemsPerPage && !isReachingEnd && (
            <Button loading={isLoadingMore} onClick={loadReplies}>
              Load More
            </Button>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .replies {
            padding-left: var(--edge-gap-double);
          }

          .comment-item {
            border-top: 1px solid var(--accents-2);
          }

          .collapsed-comment {
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: var(--edge-gap);
            padding-left: calc(var(--edge-gap-double) + 40px);
          }

          .load-more {
            display: flex;
            justify-content: center;
          }

          .reply {
            border-top: 1px solid var(--accents-2);
          }
        `}
      </style>
    </>
  )
}
