import { useEffect, useRef } from 'react'
import useSWR, { useSWRPages } from 'swr'

import API from '@lib/api/api-endpoints'
import Button from '../../../generic/button/button'
import ContentDetailView from '../content-detail-view/content-detail-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import EmptyList from '@components/generic/empty-list'
import LoadingItems from '@components/generic/loading/loading-items'
import fetch from '@lib/fetcher'
import { useOnScreen } from '@lib/client/hooks'

interface Props {
  infiniteScroll?: boolean
  addComments?: boolean
  query?: string
  initialData?: any
  type: ContentTypeDefinition
}

export default function Named({
  query = '',
  addComments,
  type,
  infiniteScroll = false,
  initialData = null
}: Props) {
  const identificator = `content-list-${type.slug}-${query}`

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
      const apiUrl = `${API.content[type.slug]}?limit=10${
        offset ? '&from=' + offset : ''
      }${query ? `&${query}` : ''}`

      const { data } = withSWR(
        useSWR(apiUrl, fetch, !offset ? { initialData } : null)
      )

      if (!data) return <LoadingItems />

      const { results = [] } = data

      return results.map((item) => {
        return (
          <div key={item.id + item.createdAt}>
            <ContentDetailView
              content={item}
              type={type}
              summary={true}
              showActions={false}
              showComments={false}
              addComments={addComments}
            />
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
      <div className="contentListView">
        {pages}
        {isLoadingMore && <LoadingItems />}
        {isEmpty && <EmptyList />}
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
