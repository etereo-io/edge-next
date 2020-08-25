import { memo } from 'react'
import Link from 'next/link'

import config from '@lib/config'
import EdgeLogo from '../../generic/icons/edge-icon/edge-icon'

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="site-logo">
            <EdgeLogo alt={true} />
          </div>

          <div className="link">
            <ul>
              <li>
                <span className="strong">Already have an account? </span>
                <Link href="/auth/login">
                  <a title="Login">Login</a>
                </Link>
              </li>
              <li>
                <Link href="/auth/signup">
                  <a title="Sign up">Sign up</a>
                </Link>
              </li>
            </ul>

            <ul>
              <li>
                <Link href="/p/about">
                  <a title="about">About</a>
                </Link>
              </li>
              <li>
                <Link href="/p/faq">
                  <a title="FAQ">FAQ</a>
                </Link>
              </li>
              <li>
                <Link href="/p/privacy-policy">
                  <a title="Privacy policy">Privacy policy</a>
                </Link>
              </li>
              <li>
                <Link href="/p/copyright-policy">
                  <a title="Copyright policy">Copyright policy</a>
                </Link>
              </li>
              <li>
                <Link href="/p/terms-of-service">
                  <a title="Terms of service">Terms of service</a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="copy">© 2020 {config.title}</div>
        </div>
      </footer>
      <style jsx>{`
        .footer {
          background: var(--edge-foreground);
          padding-top: var(--edge-gap-double);
          padding-bottom: var(--edge-gap-double);
          padding-left: var(--edge-gap);
          padding-right: var(--edge-gap);
          color: var(--edge-background);
        }
        .site-logo {
          margin-bottom: 24px;
          width: 40px;
        }

        .site-logoImg {
          max-width: 100%;
        }

        .footer-content {
          max-width: var(--edge-page-width);
          margin: 0 auto;
        }

        .links {
          font-weight: 500;
        }

        a {
          color: var(--edge-background);
          text-decoration: none;
        }

        .strong {
          color: var(--edge-secondary);
          padding-right: var(--edge-gap);
        }

        ul {
          display: flex;
          margin-bottom: 10px;
          list-style: none;
          flex-wrap: wrap;
        }

        li {
          padding-bottom: var(--edge-gap);
          padding-right: var(--edge-gap);
        }

        .copy {
          color: var(--edge-secondary);
          margin-top: 30px;
        }
      `}</style>
    </>
  )
}

export default memo(Footer)
