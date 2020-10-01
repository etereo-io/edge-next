import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { mutate } from 'swr'

import Card from '@components/generic/card/card'
import Form from '@components/auth/login-register.form'
import Layout from '@components/layout/auth/auth-layout'
import fetch from '@lib/fetcher'
import { useUser } from '@lib/client/hooks'

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })
  const router = useRouter()
  const { from } = router.query

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState('')

  async function handleSubmit(data) {
    if (errorMsg) setErrorMsg('')

    const body = {
      email: data.email,
      password: data.password,
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
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        >
          <Form
            isLogin
            errorMessage={errorMsg}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </GoogleReCaptchaProvider>
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
