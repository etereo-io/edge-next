import Button from '../../generic/button/button'
import DropdownMenu from '../../generic/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import ThemeSelector from '../../generic/theme-selector/theme-selector'
import config from '../../../lib/config'
import { hasPermission } from '../../../lib/permissions'
import styles from './header.module.scss'
import { useEffect } from 'react'
import { useUser } from '../../../lib/hooks'

function PublicUserHeader() {
  return (
    <nav>
      <ul className={styles.navigation}>
        <li>
          <Link href="/auth/login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          <Button href="/auth/signup">Get Started</Button>
        </li>

        <DropdownMenu align="right">
          <ul>
            <li>
              <ThemeSelector />
            </li>
            <li>
              <Link href="/components">
                <a>Components</a>
              </Link>
            </li>
          </ul>
        </DropdownMenu>
      </ul>
    </nav>
  )
}

function LoggedInUserHeader(props) {
  const user = props.user

  useEffect(() => {
    if (config.user.captureGeolocation) {
      // TODO: Ask for geolocation
    }
  }, [])
  return (
    <nav>
      <ul className={styles.navigation}>
       
        {hasPermission(user, 'admin.access') && (
          <li>
            <Link href="/admin">
              <a>Admin Dashboard</a>
            </Link>
          </li>
        )}

        <DropdownMenu align="right" width={'155px'}>
          <ul>
            <li>
              <ThemeSelector />
            </li>
            <li>
              <Link href="/profile/me">
                <a>Profile</a>
              </Link>
            </li>
          </ul>
          <span className="spacer"></span>
          <h4>Content</h4>
          <ul>
            {config.content.types
            .filter((type) => {
              return hasPermission(user, `content.${type.slug}.create`)
            })
            .map((type) => {
              return (
                <li key={type.slug}>
                  <Link href={`/create/${type.slug}`}>
                    <a>Create {type.title.en}</a>
                  </Link>
                </li>
              )
            })}
          </ul>

          <span className="spacer"></span>
          <ul>
            <li>
              <a href="/api/auth/logout">Logout</a>
            </li>
          </ul>
        </DropdownMenu>
      </ul>
    </nav>
  )
}

const Header = () => {
  const { user } = useUser({
    userId: 'me'
  })

  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <div className={styles['left-header']}>
          <Link href="/">
            <a title="Home page">
              <img className={styles['logo']} src="/static/logos/logo.svg" />
            </a>
          </Link>
        </div>

        <div className={styles['right-header']}>
          {user && <LoggedInUserHeader user={user} />}
          {!user && <PublicUserHeader />}
        </div>
      </div>
    </header>
  )
}

export default Header
