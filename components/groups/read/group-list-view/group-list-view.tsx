import { useEffect, useRef, memo, Fragment, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import { useOnScreen, useInfinityList } from '@lib/client/hooks'
import LoadingItems from '@components/generic/loading/loading-items'
import EmptyList from '@components/generic/empty-list'
import { GroupEntityType } from '@lib/types'
import { GroupTypeDefinition } from '@lib/types/groupTypeDefinition'
import Sorting, { SortingValue } from '@components/generic/sorting'

import Item from './item'

const sortingOptions = [
  { label: 'Most recent', value: 'createdAt' },
  { label: 'Title', value: 'title' },
]

interface Props {
  type: GroupTypeDefinition
  infiniteScroll?: boolean
  query?: string
  defaultSortOptions?: SortingValue
  initialData?: object | object[]
  withSorting?: boolean
}

function GroupListView({
  infiniteScroll,
  query,
  type,
  initialData,
  withSorting = true,
  defaultSortOptions = { sortBy: 'createdAt', sortOrder: 'DESC' },
}: Props) {
  const [sorting, setSorting] = useState<SortingValue>(defaultSortOptions)
  const { sortBy, sortOrder } = sorting
  let initData = null

  if (initialData) {
    if (Array.isArray(initialData)) {
      initData = initialData
    } else {
      initData = [initialData]
    }
  }

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
    sortBy,
    sortOrder,
    config: { initialData: initData, revalidateOnFocus: false },
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
        {withSorting && (
          <Sorting
            value={sorting}
            onChange={setSorting}
            options={sortingOptions}
          />
        )}
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
