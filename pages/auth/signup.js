import Form from '../../components/auth/login-register.form'
import Layout from '../../components/layout/auth/auth-layout'
import Router from 'next/router'
import fetch from '../../lib/fetcher'
import { useState } from 'react'
import { useUser } from '../../lib/client/hooks'

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

    if (body.password !== e.currentTarget.passwordrepeat.value) {
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
        .form-title{
          display: block;
          margin: 0 auto;
          max-width: 480px;
        }
      `}</style>
    </Layout>
  )
}

export default Signup
