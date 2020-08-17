import { useEffect, useRef, memo, Fragment } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import ContentDetailView from '../content-detail-view/content-detail-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import EmptyList from '@components/generic/empty-list'
import LoadingItems from '@components/generic/loading/loading-items'
import { useInfinityList, useOnScreen } from '@lib/client/hooks'
import { GroupEntityType } from '@lib/types'

interface Props {
  infiniteScroll?: boolean
  addComments?: boolean
  query?: string
  initialData?: any
  type: ContentTypeDefinition
}

function ContentListView({
  query = '',
  addComments,
  type,
  infiniteScroll = false,
  initialData = null,
}: Props) {
  const {
    data,
    loadNewItems,
    isReachingEnd,
    isEmpty,
    isLoadingMore,
  } = useInfinityList<GroupEntityType>({
    url: `${API.content[type.slug]}`,
    limit: 10,
    query,
    config: { initialData },
  })

  const $loadMoreButton = useRef(null)
  const isOnScreen = useOnScreen($loadMoreButton, '200px')

  useEffect(() => {
    if (isOnScreen && infiniteScroll) {
      loadNewItems()
    }
  }, [isOnScreen, infiniteScroll])

  return (
    <>
      <div className="contentListView">
        {data.map((item) => (
          <Fragment key={`${item.id}${item.createdAt}`}>
            <ContentDetailView
              content={item}
              type={type}
              summary={true}
              showActions={false}
              showComments={false}
              addComments={addComments}
            />
          </Fragment>
        ))}
        {isLoadingMore && <LoadingItems />}
        {isEmpty && <EmptyList />}
        <div className="load-more">
          {isReachingEnd ? null : (
            <Button
              reference={$loadMoreButton}
              loading={isLoadingMore}
              big={true}
              fullWidth={true}
              onClick={loadNewItems}
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

export default memo(ContentListView)
