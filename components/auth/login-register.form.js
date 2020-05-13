import Link from 'next/link'
import { useState } from 'react'

import Button from '../generic/button/button'
import PasswordStrength from '../generic/password-strength/password-strength'

import config from '../../lib/config'

const Form = ({ isLogin, errorMessage, onSubmit, loading }) => {
  const [password, setPassword] = useState('')
  const onChangePassword = (ev) => {
    setPassword(ev.target.value)
  }

  const hasSocialProviders =
    config.user.providers.facebook ||
    config.user.providers.google ||
    config.user.providers.github

  return (
    <div className="auth-form-wr">
      <strong className="form-title">{isLogin ? 'Login' : 'Sign up'}</strong>
      <div className="auth-form">
        <div className="social">
          <div className="social-buttons">
            {config.user.providers.google && (
              <div className="social-button">
                <Link href="/api/auth/facebook">
                  <a title="Sign up with Facebook">
                    <Button
                      fullWidth
                      hoverable
                    ><span className="social-link"><img src="/icons/google.svg" alt="Google icon" /> Continue with google</span></Button>
                  </a>
                </Link>
              </div>
            )}
            {config.user.providers.facebook && (
              <div className="social-button">
                <Button fullWidth
                      hoverable ><span className="social-link"><img src="/icons/facebook.svg" alt="facebook icon" /> Continue with facebook</span></Button>
              </div>
            )}
            {config.user.providers.github && (
              <div className="social-button">
                <Button fullWidth
                      hoverable><span className="social-link"><img src="/icons/github.svg" alt="github icon" /> Continue with github</span></Button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit}>
          {hasSocialProviders && <hr className="sign-up-form-separator"></hr>}
          {!isLogin && (
            <div className="input-group required">
              <input
                type="text"
                placeholder="Choose username"
                name="username"
                required
              ></input>
            </div>
          )}
          <div className="input-group required">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
            ></input>
          </div>
          <div className="input-group password required">
            <input
              type="password"
              name="password"
              onChange={onChangePassword}
              value={password}
              placeholder="Password"
              required
            ></input>
            <div className="toggle-password">
              <svg
                className="show-password"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 12"
              >
                <path
                  fill="#000"
                  fill-rule="nonzero"
                  d="M9 .375C5.25.375 2.0475 2.7075.75 6c1.2975 3.2925 4.5 5.625 8.25 5.625S15.9525 9.2925 17.25 6C15.9525 2.7075 12.75.375 9 .375zM9 9.75C6.93 9.75 5.25 8.07 5.25 6c0-2.07 1.68-3.75 3.75-3.75 2.07 0 3.75 1.68 3.75 3.75 0 2.07-1.68 3.75-3.75 3.75zm0-6C7.755 3.75 6.75 4.755 6.75 6S7.755 8.25 9 8.25 11.25 7.245 11.25 6 10.245 3.75 9 3.75z"
                />
              </svg>
              <svg
                className="hide-password"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 15"
              >
                <path
                  fill="#000"
                  fill-rule="nonzero"
                  d="M9.0038 3.2514c2.0709 0 3.7517 1.6807 3.7517 3.7517 0 .4877-.0976.9454-.2702 1.373l2.191 2.191c1.133-.9453 2.026-2.1684 2.5737-3.564-1.298-3.294-4.502-5.6276-8.2538-5.6276a8.7379 8.7379 0 00-2.9863.5253l1.6207 1.6207c.4277-.1726.8854-.2701 1.3732-.2701zM1.5003 1.2029l1.7108 1.7108.3452.3452C2.3107 4.2269 1.3353 5.5174.75 7.003c1.298 3.294 4.502 5.6275 8.2538 5.6275 1.163 0 2.2735-.225 3.2864-.6303l.3152.3152 2.1985 2.191.953-.953L2.4532.25l-.953.953zm4.1494 4.1494l1.163 1.163c-.0375.1576-.06.3227-.06.4878 0 1.2455 1.0055 2.251 2.251 2.251.1651 0 .3302-.0225.4878-.06l1.163 1.163c-.5027.2476-1.058.3977-1.6507.3977-2.071 0-3.7518-1.6808-3.7518-3.7517 0-.5928.1501-1.148.3977-1.6508zm3.234-.5852l2.3636 2.3635.015-.12c0-1.2456-1.0055-2.251-2.251-2.251l-.1276.0075z"
                />
              </svg>
            </div>
          </div>

          {!isLogin && (
            <div className="input-group required">
              <PasswordStrength password={password} />
            </div>
          )}

          {!isLogin && (
            <div className="terms">
              By signing up you agree to our{' '}
              <Link href="/p/terms-of-service">
                <a title="Terms">Terms of Service</a>
              </Link>
              
              . Learn more about our{' '}
              <Link href="/p/privacy-policy">
                <a title="Privacy policy">Privacy policy</a>
              </Link>{' '}
              and our{' '}
              <Link href="/p/copyright-policy">
                <a title="Copyright policy">Copyright policy</a>
              </Link>
              .
            </div>
          )}

          <div className="submit">
            {isLogin ? (
              <>
               
                <Button
                  loading={loading}
                  big={true}
                  alt={true}
                  fullWidth={true}
                  type="submit"
                >
                  Login
                </Button>

                <div className="alt-actions">
                  <Link href="/auth/signup">
                    <a title="Go to signup">I don't have an account</a>
                  </Link>
                  <Link href="/auth/remember">
                    <a title="Go to password remember">I don't remember my password</a>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Button
                  loading={loading}
                  big={true}
                  alt={true}
                  fullWidth={true}
                  type="submit"
                >
                  Sign up
                </Button>

                <div className="alt-actions">
                  <Link href="/auth/login">
                    <a title="Go to login">I already have an account</a>
                  </Link>
                </div>
              </>
            )}
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>

      <style jsx>{`
        .auth-form-wr {
          padding: var(--empz-gap-double) 0;
          position: relative;
          width: 100%;
        }

        .auth-form-wr::before {
          background: var(--accents-1);
          border-bottom: 1px solid var(--accents-2);
          content: '';
          height: 50%;
          max-height: 280px;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .social-button a {
          text-decoration: none;
        }

        .social-link {
          display: flex; 
          justify-content: flex-start;
          padding-left: 15px;
          align-items: center;
        }

        .social-link img {
          width: 20px;
          margin-right: 10px;
        }

        .sign-up-form-separator {
          overflow: visible;
          padding: 0;
          margin: var(--empz-gap-medium) 0 var(--empz-gap-half) 0;
          border: none;
          border-top: 1px solid var(--accents-2);
          color: var(--accents-3);
          text-align: center;
        }

        .sign-up-form-separator::after {
          content: 'Or';
          display: inline-block;
          position: relative;
          top: var(--empz-gap-half-negative);
          padding: 0 var(--empz-gap);
          background: var(--empz-background);
        }

        .auth-form {
          background: var(--empz-background);
          border-radius: 4px;
          box-shadow: var(--shadow-large);
          padding: var(--empz-gap-medium);
          position: relative;
          margin: 0 auto;
          max-width: 480px;
        }

        .form-title {
          color: var(--empz-foreground);
          display: block;
          font-size: 32px;
          font-weight: 500;
          margin: 0 auto var(--empz-gap-medium) auto;
          max-width: 480px;
          position: relative;
          text-align: center;
        }

        .terms {
          margin-bottom: var(--empz-gap);
          font-size: 13px;
        }

        .terms a {
          color: var(--empz-foreground);
        }

        .social-button {
          margin-bottom: var(--empz-gap-half);
        }

        .alt-actions {
          font-size: 13px;
          margin-top: var(--empz-gap);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .alt-actions a {
          display: block;
          color: var(--empz-foreground);
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

export default Form
