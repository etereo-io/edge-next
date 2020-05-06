
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
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
        </div>
        <div className="p">
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
        </div>
      </div>

      <style jsx>{
        `
        .p {
          background: var(--empz-background);
          padding: var(--empz-gap);
          margin-bottom: var(--empz-gap);
          border: var(--empz-light-border);
          border-radius: var(--empz-radius);
        }
        .r {
          margin-bottom: var(--empz-gap);
        }
        `
      }</style>
    </>
  )
}

function EmptyComponent() {
  return <div className="empty">Be the first to comment.</div>
}

export default function (props) {

  const identificator = 'comment-list-' + props.type.slug

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
      const apiUrl = `${API.comments[props.type.slug]}/${props.contentId}?limit=10${
        offset ? '&from=' + offset : ''
      }`
      const { data } = withSWR(
        useSWR(apiUrl, fetch, { initialData: props.initialData })
      )

      if (!data) return <LoadingItems />

      const { results = [] } = data
      return results.map((item) => {
        return (
          <div key={item.id}>
            <div  className={`item`}>
                <CommentItem comment={item} type={props.type} contentId={props.contentId} />
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

  const $loadMoreButton = useRef(null)
  const isOnScreen = useOnScreen($loadMoreButton, '200px')

  useEffect(() => {
    if (isOnScreen) loadMore()
  }, [isOnScreen])

  return (
    <>
      <div className="comment-feed-view">
        <div className={`items`}>
          {props.newComments.map(item => {
            return  <div key={item.id} className={`item`}>
                <CommentItem comment={item} type={props.type} contentId={props.contentId} />
            </div>
          })}
          {!isEmpty ? pages : <EmptyComponent />}
          {isLoadingMore && <LoadingItems />}
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
