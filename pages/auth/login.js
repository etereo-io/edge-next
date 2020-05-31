import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Card from '@components/generic/card/card'
import Form from '@components/auth/login-register.form'
import Layout from '@components/layout/auth/auth-layout'
import fetch from '@lib/fetcher'
import { mutate } from 'swr'
import { useUser } from '@lib/client/hooks'

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })
  const router = useRouter()
  const { from } = router.query

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState('')

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

      mutate('/api/users/me')

      Router.push('/')
    } catch (error) {
      const defaultMessage =
        'Error while logging in, check if the email and password are correct'
      if (error.body) {
        const resp = await error.json()
        setErrorMsg(resp.error || defaultMessage)
      } else {
        setErrorMsg(error.message || defaultMessage)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    if (from && from === 'signup') {
      setShowAlert(
        'Please, verify your email address before login in. We have sent you an email.'
      )
    }
  }, [from])

  return (
    <Layout title="Login" fullWidth={true}>
      {showAlert && (
        <Card success style={{ marginBottom: '15px' }}>
          <h3>{showAlert}</h3>
        </Card>
      )}
      <div className="login">
        <Form
          isLogin
          errorMessage={errorMsg}
          loading={loading}
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

export default Login
