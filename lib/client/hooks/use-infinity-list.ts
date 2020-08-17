import { useCallback, useState } from 'react'
import { useSWRInfinite } from 'swr'
import { ConfigInterface } from 'swr/dist/types'

import fetch from '@lib/fetcher'

type getKeyProps = {
  url: string
  sortBy?: string
  sortOrder?: string
  limit?: number
  query?: string
}

const getKey = ({
  url,
  sortBy = '',
  sortOrder = '',
  limit = 10,
  query = '',
}: getKeyProps) => (pageIndex, previousPageData): string => {
  if (
    previousPageData &&
    (limit * pageIndex >= previousPageData.total ||
      previousPageData.total < limit)
  ) {
    return null // reached the end
  }

  const from = pageIndex * limit

  return `${url}?limit=${limit}${from ? '&from=' + from : ''}${
    sortBy ? '&sortBy=' + sortBy : ''
  }
  ${sortOrder ? '&sortOrder=' + sortOrder : ''}${
    query ? '&query=' + query : ''
  }`
}

type DefaultListResponse<Data = any> = {
  results: Data[]
  from: number
  limit: number
  total: number
}

type Props = {
  url: string
  sortBy?: string
  sortOrder?: string
  limit?: number
  config?: ConfigInterface & { initialSize?: number; revalidateAll?: boolean }
  query?: string
}

interface Result<Data, Item> {
  error?: Error
  loadNewItems: () => void
  size?: number
  setSize?: (
    size: number | ((size: number) => number)
  ) => Promise<Data[] | undefined>
  isLoadingMore: boolean
  isValidating: boolean
  isReachingEnd: boolean
  isRefreshing: boolean
  isEmpty: boolean
  data: Item[]
  total: number
}

function useInfinityList<Item>({
  url,
  sortBy,
  sortOrder,
  limit,
  config = {},
  query,
}: Props): Result<DefaultListResponse<Item>, Item> {
  const {
    data: response,
    size,
    setSize,
    error,
    isValidating,
    ...rest
  } = useSWRInfinite<DefaultListResponse<Item>>(
    getKey({ url, sortBy, sortOrder, limit, query }),
    fetch,
    config
  )
  const [isLoading, setIsLoading] = useState(false)

  const data = response
    ? [].concat(...response.map(({ results }) => results))
    : []

  let total = 0

  if (response) {
    ([{total}] = response)
  }

  const isLoadingInitialData = !response && !error
  const isLoadingMore = isLoadingInitialData || isLoading
  const isEmpty = response?.[0]?.results.length === 0
  const isReachingEnd = isEmpty || limit * size >= total
  const isRefreshing = isValidating && response && response.length === size
  const loadNewItems = useCallback(() => {
    setIsLoading(true)
    setSize(size + 1).then((res) => {
      setIsLoading(false)
    })
  }, [setSize, size])

  return {
    ...rest,
    error,
    isValidating,
    data,
    loadNewItems,
    size,
    setSize,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    isEmpty,
    total,
  }
}

export default useInfinityList
