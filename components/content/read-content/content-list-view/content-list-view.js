import { useEffect, useRef } from 'react'
import useSWR, { useSWRPages } from 'swr'

import API from '../../../../lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import ContentSummaryView from '../content-summary-view/content-summary-view'
import fetch from '../../../../lib/fetcher'
import { useOnScreen } from '../../../../lib/hooks'

function Placeholder() {
  return (
    <div className="placeholders">
      <div className="p"></div>
      <div className="p"></div>
      <div className="p"></div>
      <div className="p"></div>
      <div className="p"></div>
    </div>
  )
}

function EmptyComponent() {
  return <div className="empty">Sorry, no items found.</div>
}

export default function (props) {
  const infiniteScroll = props.infiniteScroll
  const query = props.query
  const identificator = 'content-list-' + props.type.slug + '-' + query
  const listView = props.type.display && props.type.display === 'grid' ? 'grid': 'list'

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
        useSWR(apiUrl, fetch, { initialData: props.initialData })
      )

      if (!data) return <Placeholder />

      const { results = [] } = data
      return results.map((item) => {
        return (
          <>
          <div key={item.id} className={`item ${listView}`}>
              <ContentSummaryView
                content={item}
                type={props.type}
                links={true}
              />
          </div>
          <style jsx>{`
              .item {
                margin-bottom: 30px;
              }
              .item.grid {
                width: 32%;
                margin-bottom: 2%; /* (100-32*3)/2 */
                position: relative;
              }
            `}</style>
          </>
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
    if (isOnScreen && infiniteScroll) loadMore()
  }, [isOnScreen])

  return (
    <>
      <div className="contentListView">
        <div className={`items ${listView}`}>
          {!isEmpty ? pages : <EmptyComponent />}
        </div>
        <div className="load-more">
          {isReachingEnd ? null : (
            <Button
              reference={$loadMoreButton}
              loading={isLoadingMore}
              big={true}
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
