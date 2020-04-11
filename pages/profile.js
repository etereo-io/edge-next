import { useUser } from '../lib/hooks'
import Layout from '../components/layout'
import ContentSummaryView from '../components/content/read-content/content-summary-view/content-summary-view'
import config from '../lib/config'
import useSWR from 'swr'
import fetch from '../lib/fetcher'
import API from '../lib/api/api-endpoints'

const Profile = () => {
  const { user, finished } = useUser({ redirectTo: '/login' })
  

  // Fetch all the content from this user
  const contentDatas = []
  config.content.types.forEach(type => {
    const url = `${API.content[type.slug]}?author=${user ? user.id: null}`
    const { data } = useSWR(url , fetch)
    contentDatas.push({
      type,
      data: data ? data.data : []
    })
  })


  // Loading
  if (!user && !finished) {
    return (
      <Layout title="Profile">
        <h1>Profile</h1>
        <div>Loading...</div>
      </Layout>
    )
  }
  

  return (
    <Layout title="Profile">
      <h1>Profile</h1>
      {user && <p>Your session: {JSON.stringify(user)}</p>}

      { contentDatas.map(cData => {
        return (
          <div className="content-block">
            <h3>User's {cData.type.title.en}s</h3>
            { cData.data.map(item => {
              return (
                <ContentSummaryView content={item} type={cData.type } />
              )
            })}
          </div>
        )
      })}

       
    </Layout>
  )
}

export default Profile
