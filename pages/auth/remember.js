import Button from '../../components/generic/button/button'
import Layout from '../../components/layout/normal/layout'
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
    <Layout title="Remember my password" fullWidth={true}>
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

          <Button
              loading={loading}
              big={true}
              alt={true}
              fullWidth={true}
              type="submit"
            >
              Send me a verification link
            </Button>

        </form>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
        
      </div>
      <style jsx>{`
      
      `}</style>
    </Layout>
  )
}

export default RememberPassword
