import { useEffect, useRef } from 'react'
import useSWR, { useSWRPages } from 'swr'

import API from '@lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import Card from '@components/generic/card/card'
import GroupSummaryView from '../group-summary-view/group-summary-view'
import fetch from '@lib/fetcher'
import { useOnScreen } from '@lib/client/hooks'
import LoadingItems from '@components/generic/loading/loading-items'
import EmptyList from '@components/generic/empty-list'

export default function(props) {
  const infiniteScroll = props.infiniteScroll
  const query = props.query
  const identificator = 'content-list-' + props.type.slug + '-' + query

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
      const apiUrl = `${API.groups[props.type.slug]}?limit=10${
        offset ? '&from=' + offset : ''
      }${query ? `&${query}` : ''}`

      const { data } = withSWR(
        useSWR(
          apiUrl,
          fetch,
          !offset ? { initialData: props.initialData } : null
        )
      )

      if (!data) return <LoadingItems />

      const { results = [] } = data
      return results.map((item) => {
        return (
          <div key={item.id + item.createdAt}>
            <div className="list-item">
              <Card>
                <GroupSummaryView
                  group={item}
                  linkToDetail={true}
                  type={props.type}
                />
              </Card>
            </div>
            <style jsx>{`
              .list-item {
                margin-bottom: var(--edge-gap);
              }
            `}</style>
          </div>
        )
      })
    },
    (SWR) => {
      // Calculates the next page offset
      const nextOffset =
        SWR.data && SWR.data.results && SWR.data.results.length >= 10
          ? SWR.data.from * 1 + SWR.data.limit * 1
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
      <div className="group-list-view">
        {pages}
        {isLoadingMore && <LoadingItems />}
        {isEmpty && <EmptyList imageTitle="No groups found" />}
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
        .load-more {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )
}
