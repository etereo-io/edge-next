import Link from 'next/link'
import {
  FacebookLoginButton,
  GoogleLoginButton,
  GithubLoginButton,
} from 'react-social-login-buttons'
import { useState } from 'react'

import Button from '../generic/button/button'
import PasswordStrength from '../generic/password-strength/password-strength'

import config from '../../lib/config'

const Form = ({ isLogin, errorMessage, onSubmit, loading }) => {
  const [password, setPassword] = useState('')
  const onChangePassword = (ev) => {
    setPassword(ev.target.value)
  }

  const hasSocialProviders = config.user.providers.facebook || config.user.providers.google || config.user.providers.github

  return (
    <div className="auth-form-wr">
      <strong className="form-title">{isLogin ? 'Login' : 'Sign up'}</strong>
      <div className="auth-form">
        <div className="social">
          <div className="social-buttons">
            {config.user.providers.facebook && (
              <div className="social-button">
                <Link href="/api/auth/facebook">
                  <a title="Sign up with Facebook">
                    <FacebookLoginButton preventActiveStyles={true} iconColor="#000000" iconSize="22px" size="100%" style={{ margin: 0, color: 'var(--empz-foreground)', background: 'var(--empz-background)', padding: 'var(--empz-gap)', boxShadow: 'var(--shadow-medium)', width: '100%' }}>
                      <span style={{ fontSize: '1rem' }}>Login with facebook</span>
                    </FacebookLoginButton>
                  </a>
                </Link>
              </div>
            )}
            {config.user.providers.google && (
              <div className="social-button">
                <GoogleLoginButton />
              </div>
            )}
            {config.user.providers.github && (
              <div className="social-button">
                <GithubLoginButton />
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
          <div className="input-group required">
            <input
              type="password"
              name="password"
              onChange={onChangePassword}
              value={password}
              placeholder="Password"
              required
            ></input>

          </div>

         

          {!isLogin && (
            <div className="input-group required">
              <input
                type="password"
                name="passwordrepeat"
                placeholder="Repeat password"
                required
              ></input>
              
              <PasswordStrength password={password} />
            
            </div>
          )}


          {!isLogin && (
            <div className="terms">
              By registering you agree to our <Link href="/p/terms-of-service"><a title="Terms">Terms</a></Link>. Learn more about our <Link href="/p/privacy-policy"><a title="Privacy policy">Privacy policy</a></Link> and our <Link href="/p/copyright-policy"><a title="Copyright policy">Copyright policy</a></Link>.
            </div>
          )}

         
          <div className="submit">
            {isLogin ? (
              <>
                {/*<Link href="/auth/signup">
                    <a>I don't have an account</a>
              </Link>*/}
                <Button
                  loading={loading}
                  big={true}
                  alt={true}
                  fullWidth={true}
                  type="submit"
                >
                  Login
                </Button>
              </>
            ) : (
              <>
                {/*<Link href="/auth/login">
                    <a>I already have an account</a>
              </Link>*/}
                <Button
                  loading={loading}
                  big={true}
                  alt={true}
                  fullWidth={true}
                  type="submit"
                >
                  Sign up
                </Button>
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

        .sign-up-form-separator {
          overflow: visible;
          padding: 0;
          margin: var(--empz-gap-double) 0 var(--empz-gap) 0;
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
          background: #fff;
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
          margin-bottom: var(--empz-gap-medium);
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}

export default Form
