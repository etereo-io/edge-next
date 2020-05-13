import Button from '../../components/generic/button/button'
import Layout from '../../components/layout/normal/layout'
import Link from 'next/link'
import Router from 'next/router'
import fetch from '../../lib/fetcher'
import { useState } from 'react'
import { useUser } from '../../lib/hooks'

const RememberPassword = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')

    const body = {
      email: e.currentTarget.email.value,
    }

    setLoading(true)
    try {
      await fetch('/api/auth/remember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      setShowConfirmation(true)
    } catch (error) {
      setLoading(false)

      setErrorMsg(
        'There was an error while trying to remember your password'
      )
    }
  }

  return (
    <Layout title="Get a new password" fullWidth={true}>
      <div className="auth-form-wr">
      <strong className="form-title">Get a new password</strong>
      <div className="auth-form">
        <div className="remember-password">
          <form onSubmit={onSubmit} >
            <div className="input-group required">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                required
              ></input>
            </div>

            <div className="info">
              <span>We will send you a verification link to change your password.</span>
            </div>

            <div className="submit">

            <Button
                loading={loading}
                big={true}
                alt={true}
                fullWidth={true}
                type="submit"
              >
                Send me a verification link
              </Button>
              
            <div className="alt-actions">
                  <Link href="/auth/login">
                    <a title="Go to password login">Go to login</a>
                  </Link>
                  <Link href="/auth/signup">
                    <a title="Go to signup">Create an account</a>
                  </Link>
                </div>
            </div>

          </form>

          {errorMsg && <p className="error-message">{errorMsg}</p>}
          
        </div>
      </div>
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

      .info {
        font-size: 13px;
        text-align: center;
        margin: var(--empz-gap);
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
    </Layout>
  )
}

export default RememberPassword

