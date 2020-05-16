import { useEffect, useRef } from 'react'
import useSWR, { useSWRPages } from 'swr'

import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import ContentDetailView from '../content-detail-view/content-detail-view'
import fetch from '../../../../lib/fetcher'
import { useOnScreen } from '../../../../lib/client/hooks'
import Placeholder from '../../../generic/loading/loading-placeholder/loading-placeholder'

function LoadingItems() {
  return (
    <>
      <div className="placeholders">
        <div className="p">
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
        </div>
        <div className="p">
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .p {
          background: var(--empz-background);
          padding: var(--empz-gap);
          margin-bottom: var(--empz-gap);
          border-radius: var(--empz-radius);
        }
        .r {
          margin-bottom: var(--empz-gap);
        }
      `}</style>
    </>
  )
}

function EmptyComponent() {
  return <div className="empty">Nothing found</div>
}

export default function (props) {
  const infiniteScroll = props.infiniteScroll
  const query = props.query
  const identificator = 'content-list-' + props.type.slug + '-' + query
  const listView =
    props.type.display && props.type.display === 'grid' ? 'grid' : 'list'

  // Fetch content type page by page
  const {
    pages,
    isLoadingMore,
    loadMore,
    isEmpty,
    isReachingEnd,
  } = useSWRPages(
    identificator,
    ({ offset, withSWR }) => {
      const apiUrl = `${API.content[props.type.slug]}?limit=10${
        offset ? '&from=' + offset : ''
      }${query ? `&${query}` : ''}`

      const { data } = withSWR(
        useSWR(apiUrl, fetch, !offset ? { initialData:  props.initialData} : null)
      )

      if (!data) return <LoadingItems />

      const { results = [] } = data
      return results.map((item) => {
        return (
          <div key={item.id + item.createdAt} >
            <div className={`item ${listView}`}>
              <ContentDetailView
                content={item}
                type={props.type}
                links={true}
                showActions={false}
                showComments={false}
              />
            </div>
            <style jsx>{`
              .item {
                margin-bottom: var(--empz-gap);
              }
              .item.grid {
                width: 32%;
                margin-bottom: 2%; /* (100-32*3)/2 */
                position: relative;
              }
            `}</style>
          </div>
        )
      })
    },
    (SWR) => {
      // Calculates the next page offset
      const nextOffset = SWR.data && SWR.data.results && SWR.data.results.length >= 10
        ? (SWR.data.from * 1) + (SWR.data.limit * 1)
        : null

      return nextOffset
    },
    []
  )

  const $loadMoreButton = useRef(null)
  const isOnScreen = useOnScreen($loadMoreButton, '200px')

  useEffect(() => {
    if (isOnScreen && infiniteScroll && !isLoadingMore) loadMore()
  }, [isOnScreen])

  return (
    <>
      <div className="contentListView">
        <div className={`items ${listView}`}>
          { pages }
          {isLoadingMore && <LoadingItems />}
          {isEmpty && <EmptyComponent />}
        </div>
        <div className="load-more">
          {isReachingEnd ? null : (
            <Button
              reference={$loadMoreButton}
              loading={isLoadingMore}
              big={true}
              fullWidth={true}
              onClick={loadMore}
            >
              Load More
            </Button>
          )}
        </div>
      </div>
      <style jsx>{`
        .content-summary-wrapper {
          margin-bottom: var(--empz-gap-double);
          border-bottom: var(--light-border);
          padding-bottom: var(--empz-gap-double);
        }

        .items.grid {
          display: flex;
          flex-wrap: wrap;
          position: relative;
          justify-content: space-between;
        }
        .load-more {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )
}
