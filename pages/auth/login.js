import Form from '../../components/auth/login-register.form'
import Layout from '../../components/layout/normal/layout'
import Router from 'next/router'
import fetch from '../../lib/fetcher'
import { useState } from 'react'
import { useUser } from '../../lib/hooks'

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true, userId: 'me' })

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')

    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    }

    setLoading(true)
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      Router.push('/')
    } catch (error) {
      setLoading(false)
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(
        'Error while logging in, check if the email and password are correct'
      )
    }
  }

  return (
    <Layout title="login">
      <div className="login">
        <Form
          isLogin
          errorMessage={errorMsg}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: var(--light-border);
          border-radius: var(--empz-radius);
          background: var(--empz-background);
        }
      `}</style>
    </Layout>
  )
}

export default Login
