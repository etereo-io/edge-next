import React, { Fragment, memo, useMemo } from 'react'

import ContentDetailView from '@components/content/read-content/content-detail-view/content-detail-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import LoadingItems from '@components/generic/loading/loading-items'
import EmptyList from '@components/generic/empty-list'
import useSWR from 'swr'
import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'

interface Props {
  id: string
  groupType: string
  contentType: string | number
  currentContentType: ContentTypeDefinition
}

function Tab({ id, contentType, groupType, currentContentType }: Props) {
  const { data } = useSWR(
    `${API.content[contentType]}?groupId=${id}&groupType=${groupType}`,
    fetch
  )

  const isLoading = useMemo(() => !data, [data])
  const isEmpty = data?.results.length === 0

  return (
    <>
      {isLoading ? (
        <LoadingItems />
      ) : isEmpty ? (
        <EmptyList />
      ) : (
        data.results.map((item) => (
          <Fragment key={item.id}>
            <ContentDetailView
              content={item}
              type={currentContentType}
              summary={false}
              showActions={false}
              showComments={false}
              addComments={false}
            />
          </Fragment>
        ))
      )}
    </>
  )
}

export default memo(Tab)
