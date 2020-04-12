import Link from 'next/link'
import { useUser } from '../../lib/hooks'
import { hasPermission } from '../../lib/permissions'
import config from '../../lib/config'
import Button from '../button/button'
import './header.scss'

function PublicUserHeader() {
  return <nav>
    <ul>
     <li>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </li>
      <li>
        <Button href="/signup">Get Started</Button>
      </li>
    </ul>
  </nav>
}


function LoggedInUserHeader(props) {
  const user = props.user
  return <nav>
    <ul>
      {config.content.types
            .filter((type) => {
              return hasPermission(user, `content.${type.slug}.write`)
            })
            .map((type) => {
              return (
                <li>
                  <Link href={`/create/${type.slug}`}>
                    <a>Create {type.title.en}</a>
                  </Link>
                </li>
              )
            })}
          {hasPermission(user, 'admin.access') && (
            <li>
              <Link href="/admin">
                <a>Admin Dashboard</a>
              </Link>
            </li>
          )}

          <li>
                <Link href="/profile">
                  <a>Profile</a>
                </Link>
              </li>
              <li>
                <a href="/api/auth/logout">Logout</a>
              </li>

    </ul>
    </nav>
}

const Header = () => {
  const { user } = useUser()

  return (
    <header className="header">
      <div className="header-content">
        <div className="left-header">
          <Link href="/"><img className="logo" src="/static/logos/logo.svg" /></Link>
        </div>

        <div className="right-header">

          { user && <LoggedInUserHeader user={user} />}
          { !user && <PublicUserHeader /> }
        </div>
      </div>

    </header>
  )
}

export default Header
