import config from '../../lib/config'
import Link from 'next/link'
import './footer.scss'

export default function () {
  return (
    <footer>
      <div className="footer-content">
        <div className="site-logo">
          <img className="logo" src="/static/logos/logo.svg" alt="Site logo" />
        </div>

        <div className="links">
          <ul>
            <li>
              <span className="strong">Already have an account? </span>
              <Link href="/login"><a title="sign in">Sign-in</a></Link>
            </li>
            <li>
              <Link href="/signup"><a title="get started">Get Started</a></Link>
            </li>
          </ul>

          <ul>
            <li>
              <Link href="/about"><a title="about">About</a></Link>
            </li>
            <li>
              <Link href="/careers"><a title="careers">Careers</a></Link>
            </li>
          </ul>
        </div>

        <div className="copy">© 2020 {config.title}</div>
      </div>
    </footer>
  )
}
