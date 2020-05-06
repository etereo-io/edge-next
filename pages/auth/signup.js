import Form from '../../components/auth/login-register.form'
import Layout from '../../components/layout/normal/layout'
import Router from 'next/router'
import fetch from '../../lib/fetcher'
import { useState } from 'react'
import { useUser } from '../../lib/hooks'

const Signup = () => {
  useUser({ redirectTo: '/', redirectIfFound: true, userId: 'me'})

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

    if (body.password !== e.currentTarget.rpassword.value) {
      setErrorMsg(`The passwords don't match`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(() => {
          Router.push('/auth/login')
        })
        .catch((err) => {
          setLoading(false)
          throw new Error(err)
        })
    } catch (error) {
      console.error('An unexpected error happened occurred:', error.message)
      setErrorMsg(error.message)
    }
  }

  return (
    <Layout title="Signup">
      <div className="login">
        <Form isLogin={false} loading={loading} errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: var(--empz-background);
        }
      `}</style>
    </Layout>
  )
}

export default Signup
