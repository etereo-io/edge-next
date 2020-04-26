import API from '../../lib/api/api-endpoints'
import Avatar from '../../components/user/avatar/avatar'
import Button from '../../components/generic/button/button'
import DropdownMenu from '../../components/generic/dropdown-menu/dropdown-menu'
import Layout from '../../components/layout/normal/layout'
import config from '../../lib/config'
import fetch from '../../lib/fetcher'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const UserSettings = (props) => {
  console.log(props)
  
  const router = useRouter()
  const { userId } = router.query
  // const available = usePermission(`user.read`, '/', 'slug')

  const { data, error } = useSWR(userId ? `${API.users}/${userId}` : null, fetch, { initialData: null})
  const finished = Boolean(data) || Boolean(error)
  // TODO : add permissions to access
  console.log(data, finished)
  // Loading
  if (!data && !finished) {
    return (
      <Layout title="UserSettings">
        <h1>User Settings</h1>
        <div>Loading...</div>
      </Layout>
    )
  }

  const user = data
  

  return (
    <Layout title="User Settings">
      
      <div className="user-settings-page">
        <div className="menu">
          <ul>
            <li>Settings</li>
            <li>Oauth</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div className="settings">
          <div className="configuration-block">
            <h2>Avatar</h2>
            <div className="block-settings">
              <p>Click on the avatar image to change it</p>
              <div className="field">
                <Avatar src={user ? user.profile.img : null} />
              </div>
            </div>
          </div>

          <div className="configuration-block">
            <h2>Username</h2>
            <div className="block-settings">
              <p>The username is unique and it's used for mentions or to access your profile. Please use 48 characters at maximum.</p>
              <div className="field">
                <input type="text" placeholder="Your username" value={user ? user.username: ''} />
              </div>
            </div>
            <div className="actions">
              <Button>Change username</Button>
            </div>
          </div>

          <div className="configuration-block">
            <h2>Your Name</h2>
            <div className="block-settings">
              <p>Please enter your full name, or a display name you are comfortable with. Please use 32 characters at maximum.</p>
              <div className="field">
                <input type="text" placeholder="Your username" value={user ? user.username: ''} />
              </div>
            </div>
            <div className="actions">
              <Button>Change username</Button>
            </div>
          </div>

          <div className="configuration-block">
            <h2>Email address</h2>
            <div className="block-settings">
              <p>A new email will require e-mail validation</p>
              <div className="field">
                <input type="text" placeholder="Email" value={user ? user.email: ''} />
              </div>
            </div>
            <div className="actions">
              <Button>Change email</Button>
            </div>
          </div>

          <div className="configuration-block">
            <h2>Change Password</h2>

            <div className="block-settings">
              <div className="field">
                <input type="password" placeholder="Current Password" />
              </div>
              <div className="field">
                <input type="password" placeholder="New Password" />
              </div>
              <div className="field">
                <input type="password" placeholder="Repeat new Password" />
              </div>
            </div>

            <div className="actions">
              <Button>Update</Button>
            </div>
          </div>

          <div className="configuration-block">
            <h2>Delete my account</h2>

            <div className="block-settings">
              <p><strong>Warning</strong>, this action can not be undone</p>
              <div className="field">
                <input type="password" placeholder="Password" />
              </div>
            </div>

            <div className="actions">
              <Button>Delete</Button>
            </div>
          </div>

        </div>
        
      </div>


      
      <style jsx>
        {
          `
            .user-settings-page {
              display: flex;
              flex-wrap: wrap;
            }

            .menu {
              width: 200px;
            }

            .configuration-block {
              border-radius: var(--empz-radius);
              overflow: hidden;
              
              margin-bottom: var(--empz-gap-double);
              background: var(--accents-2);
            }

            .configuration-block h2 {
              display: block;
              padding: var(--empz-gap);
              background: var(--empz-foreground);
              color: var(--empz-background);
              margin-bottom: var(--empz-gap);
            }

            .configuration-block .block-settings {
              padding: var(--empz-gap);
            }

            .configuration-block .block-settings p {
              margin-bottom: var(--empz-gap);
            }

            .configuration-block .actions {
              padding: var(--empz-gap);
              display: flex;
              justify-content: flex-end;
            }

          `
        }
      </style>
    </Layout>
  )
}

export default UserSettings
