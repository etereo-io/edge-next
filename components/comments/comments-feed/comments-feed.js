
import { useEffect, useRef } from 'react'
import useSWR, { useSWRPages } from 'swr'
import API from '../../../lib/api/api-endpoints'
import fetch from '../../../lib/fetcher'
import { useOnScreen } from '../../../lib/hooks'
import Button from '../../generic/button/button'
import Placeholder from '../../generic/loading/loading-placeholder/loading-placeholder'
import CommentItem from '../comment-item/comment-item'

function LoadingItems() {
  return (
    <>
      <div className="placeholders">
        <div className="p">
          <div className="a">
          <Placeholder width={'40px'} height={'40px'} borderRadius={'100%'}/>
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
        <div className="p">
          <div className="a">
          <Placeholder width={'40px'} height={'40px'} borderRadius={'100%'}/>
          </div>
          <div className="d">
            <div className="r">
              <Placeholder width={'100%'} height={'10px'} />
            </div>
            <div className="r">
              <Placeholder width={'100%'} height={'40px'}  />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{
        `
        .p {
          background: var(--empz-background);
          padding: var(--empz-gap-half);
          margin-bottom: var(--empz-gap-half);
          border: var(--light-border);
          border-radius: var(--empz-radius);
          display: flex;
        }

        .d {
          flex: 1;
          padding-left: var(--empz-gap-half);
        }
        .r {
          margin-bottom: var(--empz-gap-half);
        }
        `
      }</style>
    </>
  )
}

function EmptyComponent() {
  return <div className="empty">Be the first to comment.</div>
}

export default function ({
  initialData = [],
  contentId = null,
  conversationId = null,
  type = {},
  newComments = [],
}) {

  const identificator = 'comment-list-' + type.slug + '-contentId-' + conversationId

  // Fetch comments page by page
  const {
    pages,
    isLoadingMore,
    loadMore,
    isEmpty,
    isReachingEnd,
  } = useSWRPages(
    identificator,
    ({ offset, withSWR }) => {
      const apiUrl = `${API.comments[type.slug]}/${contentId}?limit=10${
        offset ? '&from=' + offset : ''
      }${conversationId ? `&conversationId=${conversationId}`: ''}`

      const { data } = withSWR(
        useSWR(apiUrl, fetch, { initialData: initialData })
      )

      if (!data) return <LoadingItems />

      const { results = [] } = data
      return results.map((item) => {
        return (
          <div key={item.id}>
            <div  className={`item`}>
              <CommentItem comment={item} type={type} contentId={contentId} conversationId={conversationId ? conversationId: item.id} />
            </div>
            <style jsx>{`
                .item {
                  margin-bottom: var(--empz-gap);
                }
              `}</style>
          </div>
        )
      })
    },
    (SWR) => {
      // Calculates the next page offset
      return SWR.data && SWR.data.results && SWR.data.results.length >= 10
        ? SWR.data.from * 1 + SWR.data.limit * 1
        : null
    },
    []
  )

  // Load more automatically when the button loadMoreButton is onScreen
  const $loadMoreButton = useRef(null)
  const isOnScreen = useOnScreen($loadMoreButton, '200px')

  useEffect(() => {
    if (isOnScreen) loadMore()
  }, [isOnScreen])

  return (
    <>
      <div className="comment-feed-view">
        <div className={`items`}>
          {newComments.map(item => {
            return <div key={item.id} className={`item`}>
              <CommentItem comment={item} type={type} contentId={contentId} conversationId={conversationId ? conversationId: item.id} />
            </div>
          })}
          {isEmpty && newComments.length === 0 && !isLoadingMore ? <EmptyComponent /> : pages }
          {isLoadingMore  && <LoadingItems />}
        </div>
        <div className="load-more">
          {isReachingEnd ? null : (
            <Button
              reference={$loadMoreButton}
              loading={isLoadingMore}
              onClick={loadMore}
            >
              Load More
            </Button>
          )}
        </div>
      </div>
      <style jsx>{`

        .comment-feed-view {
          max-width: 500px;
          margin: 0 auto;
        }

        .load-more {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )

}
