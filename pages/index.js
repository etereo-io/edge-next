import { useUser } from '../lib/hooks'
import Layout from '../components/layout'
import useSWR from 'swr'
import fetch from 'isomorphic-unfetch'

import API from '../lib/api-endpoints'
console.log(API)
const fetcher = url =>
  fetch(url)
    .then(r => r.json())
    


// export async function getServerSideProps() {
//   const data = await fetcher(API.content.post)
//   return { props: { data } }
// }
 

const Home = (props) => {
  const { user } = useUser()
  const initialData = props.data
  const { data } = useSWR(API.content.post, fetcher, { initialData })

  return (
    <Layout>
      <h1>Empieza Next</h1>

      { JSON.stringify(data)}
      {user && <p>Currently logged in as: {JSON.stringify(user)}</p>}

      <style jsx>{`
        li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </Layout>
  )
}

export default Home
