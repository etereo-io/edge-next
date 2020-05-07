import Button from '../../generic/button/button'
import DropdownMenu from '../../generic/dropdown-menu/dropdown-menu'
import EdgeLogo from '../../generic/icons/edge-icon/edge-icon'
import Link from 'next/link'
import ThemeSelector from '../../generic/theme-selector/theme-selector'
import config from '../../../lib/config'
import { hasPermission } from '../../../lib/permissions'
import { useEffect } from 'react'
import { useUser } from '../../../lib/hooks'


function UserHeader(props) {
  const user = props.user

  useEffect(() => {
    if (config.user.captureGeolocation) {
      // TODO: Ask for geolocation
    }
  }, [])
  return (
    <nav>
      {user && (<ul className='navigation'>
        
        {hasPermission(user, 'admin.access') && (
          <li>
            <Link href="/admin">
              <a>Admin Dashboard</a>
            </Link>
          </li>
        )}

        <li>
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
        </li>
      </ul>)}
      { !user && (
        <ul className='navigation'>
          <li>
            <Link href="/auth/login">
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Button href="/auth/signup">Get Started</Button>
          </li>

          <li>
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
          </li>
        </ul>
      )}
      <style jsx>{
      `
      .navigation {
        display: flex;
        list-style: none;
        margin-left: 0;
        padding-left: 0;
        align-items: center;
      }
      
      li {
        margin-right: 1rem;
      }
      
      @media (max-width: 600px) {
        li {
          font-size: 13px;
        }
      }
      
      li:first-child {
        margin-left: auto;
      }
      a {
        color: var(--empz-link-color);
        display: block;
        font-size: 14px;
        text-decoration: none;
      }
      `
      }</style>
    </nav>
  )
}

const Header = () => {
  const { user } = useUser({
    userId: 'me'
  })

  return (
    <>
      <header className='header'>
        <div className='header-content'>
          <div className='left-header'>
            <Link href="/">
              <a title="Home page">
                {/*<img className={'logo'} src="/static/logos/logo.svg" /> */}
                <EdgeLogo />
              </a>
            </Link>
          </div>

          <div className='right-header'>
            <UserHeader user={user} />
          </div>
        </div>
      </header>
    <style jsx>{
      `
      .header {
        color: var(--empz-foreground);
        background: var(--empz-background);
        display: flex;
        border-bottom: 1px solid var(--accents-2);
        height: 56px;
        position: sticky;
        top: 0;
        z-index: 4;
      }

      .header-content {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        justify-content: space-between;
        align-items: center;
        padding: 0 var(--empz-gap-double);
        width: 100%;
      }

      @media (max-width: 600px) {
        .header-content {
          padding: 0 var(--empz-gap);
        }
      }

      .logo {
        width: 32px;
        cursor: pointer;
      }

      
      `
    }</style>
    </>
  )
}

export default Header
