import Button from '@components/generic/button/button'
import Layout from '@components/layout/auth/auth-layout'
import Link from 'next/link'
import PasswordStrength from '@components/generic/password-strength/password-strength'
import fetch from '@lib/fetcher'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useUser } from '@lib/client/hooks'

const RememberPassword = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })
  const router = useRouter()
  const { token, email } = router.query


  const [errorMsg, setErrorMsg] = useState('')
  const [password, setPassword] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')

    if (!email || !token) {
      setErrorMsg('Invalid token.')
      return
    }
    
    if (!password) {
      setErrorMsg('Please introduce a valid password')
      return
    } else if(password.length < 6) {
      setErrorMsg('Password length should be greater than 6 characters')
      return
    }

    setLoading(true)
    setShowConfirmation(false)

    
    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password,
        email,
        token
      })
    })
    .then(() => {

      setLoading(false)
      setShowConfirmation(true)
      setErrorMsg('')
      setPassword('')
    })
    .catch(error => {
      setLoading(false)

      setErrorMsg(
        'There was an error while trying to reset your password'
      )
    })

  }

  const onChangePassword = (ev) => {
    setPassword(ev.target.value)
  }

  return (
    <Layout title="Update your password" fullWidth={true}>
      
        <div className="remember-password">
          <form onSubmit={onSubmit} >
            <div className="input-group password required">
              <input
                type="password"
                name="password"
                onChange={onChangePassword}
                value={password}
                placeholder="Password"
                required
              ></input>
            </div>

            <div className="input-group required">
              <PasswordStrength password={password} />
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
                Update my password
              </Button>
              
              <div className="alt-actions">
                <Link href="/auth/login">
                  <a title="Go to password login">Go to login</a>
                </Link>
              </div>
            </div>

          </form>

          {errorMsg && <p className="error-message">{errorMsg}</p>}
          {showConfirmation && <p className="success-message">Your password has been updated, now you can Log In.</p>}
          
      </div>
      <style jsx>{`
    
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

