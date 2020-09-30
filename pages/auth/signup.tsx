import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import React, { useState } from 'react'
import Router from 'next/router'

import Form from '@components/auth/login-register.form'
import Layout from '@components/layout/auth/auth-layout'
import fetch from '@lib/fetcher'
import { useUser } from '@lib/client/hooks'

const Signup = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data) {
    if (errorMsg) setErrorMsg('')

    const body = {
      email: data.email,
      username: data.username,
      password: data.password,
      identificationNumber: data.identificationNumber,
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
    <Layout title="Registro" fullWidth={true}>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
      >
        <Form
          isLogin={false}
          loading={loading}
          errorMessage={errorMsg}
          onSubmit={handleSubmit}
        />
      </GoogleReCaptchaProvider>
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
