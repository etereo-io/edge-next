import { useEffect, useRef, memo, Fragment } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { useOnScreen, useInfinityList } from '@lib/client/hooks'
import LoadingItems from '@components/generic/loading/loading-items'
import EmptyList from '@components/generic/empty-list'
import { GroupEntityType } from '@lib/types'

import Item from './item'

function GroupListView({ infiniteScroll, query, type, initialData }) {
  const {
    data,
    loadNewItems,
    isReachingEnd,
    isEmpty,
    isLoadingMore,
  } = useInfinityList<GroupEntityType>({
    url: `${API.groups[type.slug]}`,
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
      <div className="group-list-view">
        {data.map((item) => (
          <Fragment key={`${item.id}${item.createdAt}`}>
            <Item item={item} type={type} />
          </Fragment>
        ))}
        {isLoadingMore && <LoadingItems />}
        {isEmpty && <EmptyList imageTitle="No groups found" />}
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

export default memo(GroupListView)
