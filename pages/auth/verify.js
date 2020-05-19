import { useEffect, useState } from 'react'

import Layout from '@components/layout/auth/auth-layout'
import fetch from '@lib/fetcher'
import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()
  const { token, email } = router.query

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  // Email verification
  useEffect(() => {
    if (token && email) {
      setLoading(true)
      fetch(`/api/auth/verify?email=${email}&token=${token}`)
        .then(() => {
          setSuccess(true)
          setLoading(false)
          setError(false)
        })
        .catch((err) => {
          setSuccess(false)
          setLoading(false)
          setError(true)
        })
    }
  }, [token, email])

  return (
    <Layout title="Verify email" fullWidth>
      <div className="verify">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">Error veryfing</div>}
        {success && (
          <div className="success-message">
            Success! Your email is verified.
          </div>
        )}
      </div>
      <style jsx>{`
        .verify {
          text-align: center;
        }
      `}</style>
    </Layout>
  )
}

export default Login
