import API from '@lib/api/api-endpoints'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import EmptyList from '@components/generic/empty-list'
import LoadingItems from '@components/generic/loading/loading-items'
import ProductSummaryView from '../product-summary-view'
import fetch from '@lib/fetcher'
import { memo } from 'react'
import useSWR from 'swr'

interface Props {
  type: ContentTypeDefinition
}

function ProductListView({
  type
}: Props) {
  
  const limit = 3
  const from = 0
  const sortBy = 'createdAt'
  const sortOrder = 'DESC'
  const url = `${API.content[type.slug]}?limit=${limit}&from=${from}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  
  const { data, error } = useSWR(
    url,
    fetch
  )
  
  const isLoading = !data && !error
  const isEmpty = data && data.results.length === 0
  
  return (
    <>
      <div className="product-list-view">
        
        {data && data.results.map((item) => (
          <div className="product-item" key={`${item.id}${item.createdAt}`}>
            <ProductSummaryView
              content={item}
              type={type}
            />
          </div>
        ))}
        {isLoading && <LoadingItems />}
        {isEmpty && <EmptyList />}
        
      </div>
      <style jsx>{`
        .product-list-view {
          display: flex;
          flex-wrap: wrap;
          align-items: top;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default memo(ProductListView)
