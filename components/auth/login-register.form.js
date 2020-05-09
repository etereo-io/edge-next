import Link from 'next/link'
import {
  FacebookLoginButton,
  GoogleLoginButton,
  InstagramLoginButton,
  GithubLoginButton,
  TwitterLoginButton,
} from 'react-social-login-buttons'
import Button from '../generic/button/button'

import config from '../../lib/config'

const Form = ({ isLogin, errorMessage, onSubmit, loading }) => {
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
                      <FacebookLoginButton />
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
              {config.user.providers.twitter && (
                <div className="social-button">
                  <TwitterLoginButton />
                </div>
              )}
              {config.user.providers.instagram && (
                <div className="social-button">
                  <Link href="/api/auth/instagram">
                    <a title="Sign up with Instagram">
                      <InstagramLoginButton />
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <hr className="sign-up-form-separator"></hr>
            {!isLogin && (
              <div className="input-group no-label required">
                <input
                  type="text"
                  placeholder="Choose username"
                  required
                ></input>
              </div>
            )}
            <div className="input-group required">
              <input type="email" placeholder="E-mail" required></input>
            </div>
            <div className="input-group no-label required">
              <input type="password" placeholder="Password" required></input>
            </div>
            {!isLogin && (
              <div className="input-group no-label required">
                <input
                  type="password"
                  placeholder="Repeat password"
                  required
                ></input>
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

            {errorMessage && <p className="error">{errorMessage}</p>}
          </form>
        </div>

        <style jsx>{`
          .auth-form-wr{
            padding: var(--empz-gap-double) 0;
            position: relative;
            width: 100%;
          }
          .auth-form-wr::before{
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
          .sign-up-form-separator {
            overflow: visible;
            padding: 0;
            margin: var(--empz-gap-double) 0 var(--empz-gap) 0;
            border: none;
            border-top: 1px solid var(--accents-2);
            color: var(--accents-3);
            text-align: center;
          }

          .sign-up-form-separator::after{
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
        `}</style>
      </div>
  )
}

export default Form
