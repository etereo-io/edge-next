import Link from 'next/link'
import { useUser } from '../lib/hooks'
import { hasPermission } from '../lib/permissions'
import config from '../lib/config'

const Header = () => {
  const {user} = useUser()

  return (
    <header>
      <nav>
        
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {
            config.content.types.filter(type => {
              return hasPermission(user, `content.${type.slug}.write`)
            })
            .map(type => {
              return (
                <li>
                  <Link href={`/create/${type.slug}`}>
                    <a>Create {type.title.en}</a>
                  </Link>
                </li>
              )
            })
          }
          { hasPermission(user, 'admin.access') && (
            <li>
              <Link href="/admin">
                <a>Admin Dashboard</a>
              </Link>
            </li>
          )}
          {user ? (
            <>
              <li>
                <Link href="/profile">
                  <a>Profile</a>
                </Link>
              </li>
              <li>
                <a href="/api/auth/logout">Logout</a>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <style jsx>{`
        nav {
          max-width: 42rem;
          margin: 0 auto;
          padding: 0.2rem 1.25rem;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
        }
        li:first-child {
          margin-left: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
        header {
          color: #fff;
          background-color: #333;
        }
      `}</style>
    </header>
  )
}

export default Header
