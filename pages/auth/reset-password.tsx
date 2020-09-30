import React, { useState, memo } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import Layout from '@components/layout/auth/auth-layout'
import fetch from '@lib/fetcher'
import { useUser } from '@lib/client/hooks'
import Form from '@components/auth/reset-password-form'

const RememberPassword = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState<string>('')
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  async function onSubmit(email: string) {
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
      })
      .catch(() => {
        setLoading(false)

        setErrorMsg('There was an error while trying to reset your password')
      })
  }

  return (
    <Layout title="Get a new password" fullWidth={true}>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
      >
        <Form setErrorMsg={setErrorMsg} loading={loading} onSubmit={onSubmit} />
      </GoogleReCaptchaProvider>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {showConfirmation && (
        <p className="success-message">
          Please, check your email inbox, you have received instructions on how
          to reset your password.
        </p>
      )}
    </Layout>
  )
}

export default memo(RememberPassword)
