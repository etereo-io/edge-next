import Button from '@components/generic/button/button'
import Layout from '@components/layout/auth/auth-layout'
import Link from 'next/link'
import fetch from '@lib/fetcher'
import { useState } from 'react'
import { useUser } from '@lib/client/hooks'

const RememberPassword = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')
  const [email, setEmail] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')
    
    if (!email) {
      setErrorMsg('Please introduce a valid email')
      return
    }

    setLoading(true)
    setShowConfirmation(false)

    
    fetch('/api/auth/reset-password?email=' + email)
    .then(() => {

      setLoading(false)
      setShowConfirmation(true)
      setErrorMsg('')
      setEmail('')
    })
    .catch(error => {
      setLoading(false)

      setErrorMsg(
        'There was an error while trying to reset your password'
      )
    })

  }

  const onChangeEmail = ev => {
    setEmail(ev.target.value)
    setErrorMsg('')
  }

  return (
    <Layout title="Get a new password" fullWidth={true}>
      
        <div className="remember-password">
          <form onSubmit={onSubmit} >
            <div className="input-group required">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={onChangeEmail}
                required
              ></input>
            </div>

            <div className="info">
              <span>We will send you a verification link to change your password.</span>
            </div>

            <div className="submit">

            <Button
                loading={loading}
                onClick={onSubmit}
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
          {showConfirmation && <p className="success-message">Please, check your email inbox, you have received instructions on how to reset your password.</p>}
          
      </div>
      <style jsx>{`
    
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

