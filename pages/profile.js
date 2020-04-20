import API from '../lib/api/api-endpoints'
import Avatar from '../components/user/avatar/avatar'
import Button from '../components/button/button'
import ContentListView from '../components/content/read-content/content-list-view/content-list-view'
import Layout from '../components/layout/normal/layout'
import UserActivity from '../components/user/activity/activity'
import config from '../lib/config'
import fetch from '../lib/fetcher'
import useSWR from 'swr'
import { useUser } from '../lib/hooks'

const Profile = () => {
  const { user, finished } = useUser({ redirectTo: '/login' })

  // Loading
  if (!user && !finished) {
    return (
      <Layout title="Profile">
        <h1>Profile</h1>
        <div>Loading...</div>
      </Layout>
    )
  }
  
  console.log(user)

  return (
    <Layout title="Profile">
      <div className="profile-user-info">
        <div className="avatar">
          <Avatar />
        </div>
        <div className="name">
          <div className="title">
            <div className="title-left"><h2>User Profile</h2></div>
            <div className="title-right"><Button alt={true}>Follow</Button><Button>Edit Profile</Button></div>
          </div>
          <div className="dashboar-bar">
            <h4>Followers</h4>
          </div>
        </div>
      </div>
      

      <div className="content-container">
        <div className="content-types">
          {config.content.types.map((cData) => {
            return (
              <div className="content-block">
                <h3>User's {cData.title.en}s</h3>
                <ContentListView infiniteScroll={false} initialData={[]} type={cData} query={`author=${user ? user.id : null}`} />
              </div>
            )
          })}
        </div>

        <div className="activity-report">
          <h3>Recent activity</h3>
          {user && <UserActivity user={user.id } />}
        </div>

      </div>
      <style jsx>
        {
          `
          .profile-user-info {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 60px;
          }
          
          .name {
            flex: 1;
          }

          h2 {
            font-size: 30px;
          }

          h3 {
            margin-bottom: 30px;
          }

          .avatar {
            width: 100px;
            margin-right: 30px;
          }

          .title {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 15px;
          }

          .content-container {
            display: flex;
            flex-wrap: wrap;
            background: #fafafa;
            border-top: 1px solid rgba(0,0,0, 0.2);
            margin-top: 30px;
            padding: 15px;
          }

          .content-types {
            flex: 0.5;
            transform: translateY(-60px);
            padding: 15px;
          }

          .activity-report {
            flex: 0.5;
            transform: translateY(-60px);
            padding: 15px;
          }

          .content-summary-content {
            padding: 15px;
            border-radius: 4px;
            background: white;
          }
          `
        }
      </style>
    </Layout>
  )
}

export default Profile
