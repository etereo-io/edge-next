import useSWR from 'swr'
import { useState, useEffect } from 'react'
import fetch from '../../../../lib/fetcher'
import API from '../../../../lib/api/api-endpoints'

import ContentSummaryView from '../content-summary-view/content-summary-view'
import './content-list-view.scss'

export default function(props) {

  const [page, setPage] = useState(0)
  const [data, setData] = useState(props.initialData || [])


  // Fetch Posts
  const { data: response } = loadItems()



  function loadItems() {
    return useSWR(`${API.content[props.type.slug]}?page=${page}`, fetch)
  }

  function loadMoreItems() {
    setPage(page + 1)
    const { data: response } = loadItems()
    console.log(response)
    setData([...data, ...response.data])
  }

  useEffect(() => {
    if (response && response.data) {
      setData(response.data)
    }
  }, [response, setData])

  // TODO Implement infinite scrolling

  return <div className="content-list-view">
    { data.map((item) => {
    return (
      <ContentSummaryView content={item} type={props.type} />
    )
  })}
  </div>
}