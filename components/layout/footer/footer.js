import EdgeLogo from '../../generic/icons/edge-icon/edge-icon'
import Link from 'next/link'
import config from '../../../lib/config'

export default function () {
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
                  <a title="sign in">Sign-in</a>
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
          background: var(--empz-foreground);
          padding-top: var(--empz-gap-double);
          padding-bottom: var(--empz-gap-double);
          padding-left: var(--empz-gap);
          padding-right: var(--empz-gap);
          color: var(--empz-background);
        }
        .site-logo {
          margin-bottom: 24px;
          width: 40px;
        }

        .site-logoImg {
          max-width: 100%;
        }

        .footer-content {
          max-width: var(--empz-page-width);
          margin: 0 auto;
        }

        .links {
          font-weight: 500;
        }

        a {
          color: var(--empz-background);
          text-decoration: none;
        }

        .strong {
          color: var(--empz-secondary);
          padding-right: var(--empz-gap);
        }

        ul {
          display: flex;
          margin-bottom: 10px;
          list-style: none;
          flex-wrap: wrap;
        }

        li {
          padding-bottom: var(--empz-gap);
          padding-right: var(--empz-gap);
        }

        .copy {
          color: var(--empz-secondary);
          margin-top: 30px;
        }
      `}</style>
    </>
  )
}
