import Form from '@components/auth/login-register.form'
import Layout from '@components/layout/auth/auth-layout'
import Router from 'next/router'
import fetch from '@lib/fetcher'
import { useState } from 'react'
import { useUser } from '@lib/client/hooks'

const Signup = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')

    const body = {
      email: e.currentTarget.email.value,
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    setLoading(true)

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(() => {
        Router.push('/auth/login?from=signup')
      })
      .catch(async (err) => {
        const defaultError = 'Email or username already taken'
        if (err.body) {
          const body = await err.json()
          setErrorMsg(body.error || defaultError)
        } else {
          setErrorMsg(err.message || defaultError)
        }
        setLoading(false)
      })
  }

  return (
    <Layout title="Signup" fullWidth={true}>
      <div className="login">
        <Form
          isLogin={false}
          loading={loading}
          errorMessage={errorMsg}
          onSubmit={handleSubmit}
        />
      </div>
      <style jsx>{`
        .form-title {
          display: block;
          margin: 0 auto;
          max-width: 480px;
        }
      `}</style>
    </Layout>
  )
}

export default Signup
