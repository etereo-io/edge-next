import { useRouter } from 'next/router'
import ContentSummaryView from '../../components/content/read-content/content-summary-view/content-summary-view'
import { usePermission } from '../../lib/hooks'

import { getContentTypeDefinition } from '../../lib/config'

import Layout from '../../components/layout/normal/layout'

import useSWR from 'swr'
import fetch from '../../lib/fetcher'
import API from '../../lib/api/api-endpoints'

function LoadingView() {
  return <h1>Loading...</h1>
}

const ContentPage = () => {
  const type = 'product'

  const contentType = getContentTypeDefinition(type)

  const available = usePermission(`content.${type}.read`, '/')

  const { data } = useSWR(API.content[type], fetch)

  return (
    available && (
      <Layout title="Content">
        <h1>Custom page demo: For {type}</h1>

        {(data ? data.results : []).map((item) => {
          return (
            <div className="product">
              {JSON.stringify(item)}
              <button>Buy now</button>
            </div>
          )
        })}
      </Layout>
    )
  )
}

export default ContentPage
