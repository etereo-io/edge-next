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
    <div className="auth-form">
      <h1>{isLogin ? 'Log in' : 'Register'}</h1>
      <div className="social">
        <h2>
          {isLogin
            ? 'Access with a social network'
            : 'Register with a social network'}
        </h2>
        <div className="social-buttons">
          {config.user.providers.facebook && <div className="social-button">
            <FacebookLoginButton />
          </div>}
          {config.user.providers.google && <div className="social-button">
            <GoogleLoginButton />
          </div>}
          {config.user.providers.github && <div className="social-button">
            <GithubLoginButton />
          </div>}
          {config.user.providers.twitter && <div className="social-button">
            <TwitterLoginButton />
          </div>}
          {config.user.providers.instagram && <div className="social-button">
            <InstagramLoginButton />
          </div>}
        </div>
      </div>

      <h2>Or {isLogin ? 'log in' : 'register'} with e-mail</h2>
      <form onSubmit={onSubmit}>
        {!isLogin && (
          <label>
            <span>Username</span>
            <input type="text" name="username" required />
          </label>
        )}
        <label>
          <span>e-mail</span>
          <input type="text" name="email" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" required />
        </label>
        {!isLogin && (
          <label>
            <span>Repeat password</span>
            <input type="password" name="rpassword" required />
          </label>
        )}

        <div className="submit">
          {isLogin ? (
            <>
              <Link href="/signup">
                <a>I don't have an account</a>
              </Link>
              <Button  loading={loading} type="submit">Login</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a>I already have an account</a>
              </Link>
              <Button loading={loading} type="submit">Signup</Button>
            </>
          )}
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
      <style jsx>{`
        h2 {
          font-weight: 300;
          font-size: 15px;
          margin-top: var(--empz-gap);
          margin-bottom: var(--empz-gap);
        }
        form,
        label {
          display: flex;
          flex-flow: column;
        }
        label > span {
          font-weight: 600;
        }
        input {
          margin: 0.3rem 0 1rem;
        }
        .social-buttons {
          margin-bottom: var(--empz-gap-double);
        }
        .social-buttons .social-button {
        }
        .submit {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          justify-content: space-between;
        }
        .submit > a {
          text-decoration: none;
          color: var(--empz-link-color);
        }

        .error {
          color: brown;
          margin: 1rem 0 0;
        }
      `}</style>
    </div>
  )
}

export default Form
