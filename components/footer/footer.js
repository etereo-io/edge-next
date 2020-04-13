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
              <Link href="/login">Sign-in</Link>
            </li>
            <li>
              <Link href="/signup">Get Started</Link>
            </li>
          </ul>

          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
          </ul>
        </div>

        <div className="copy">© 2020 {config.title}</div>
      </div>
    </footer>
  )
}
