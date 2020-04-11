import { useRouter } from 'next/router'
import ContentSummaryView from '../../components/content/read-content/content-summary-view/content-summary-view'
import { usePermission } from '../../lib/hooks'

import {getContentTypeDefinition } from '../../lib/config'

import Layout from '../../components/layout'

import useSWR from 'swr'
import fetch from '../../lib/fetcher'
import API from '../../lib/api/api-endpoints'


function LoadingView() {
  return (<h1>Loading...</h1>)
}

const ContentPage = () => {
  const router = useRouter()
  const {
    query: { type },
  } = router

  if (!type) {
    return <LoadingView />
  }

  const contentType = getContentTypeDefinition(type)

  const locked = usePermission(`content.${type}.read`, '/', 'type')
  
  const { data } = useSWR(API.content[type], fetch)

  return (
    !locked && (
      <Layout title="Content">
        <h1>List of {type}</h1>

        { (data ? data.data : []).map(item => {
          return (
            <ContentSummaryView content={item} type={contentType } />
          )
        })}
      </Layout>
    )
  )
  
}

export default ContentPage
