import { useEffect, useState } from 'react'

import Layout from '../../components/layout/normal/layout'
import fetch from '../../lib/fetcher'
import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()
  const { token, email } = router.query

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)


  // Email verification 
  useEffect(() => {
    if (token && email ) {
      setLoading(true)
      fetch(`/api/auth/verify?email=${email}&token=${token}`)
        .then(() => {
          setSuccess(true)
          setLoading(false)
          setError(false)
        })
        .catch(err => {
          setSuccess(false)
          setLoading(false)
          setError(true)
        })
    }
  }, [token, email])

  return (
    <Layout title="verify">
      <div className="verify">
        <h1>Verifying your email</h1>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">Error veryfing</div>}
        {success && <div className="Success">Success! Your email is verified.</div>}
      </div>
      <style jsx>{`
        .verify {
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
