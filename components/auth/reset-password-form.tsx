import React, { memo, useState } from 'react'

import Button from '@components/generic/button/button'
import Link from 'next/link'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type Props = {
  loading: boolean
  setErrorMsg: (msg: string) => void
  onSubmit: (email: string) => Promise<any>
}

function RememberPasswordForm({ onSubmit, loading, setErrorMsg }: Props) {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [email, setEmail] = useState<string>('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = await executeRecaptcha('reset_password')

    if (token) {
      onSubmit(email).then(() => setEmail(''))
    }
  }

  const onChangeEmail = (ev) => {
    setEmail(ev.target.value)

    setErrorMsg('')
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="input-group required">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={onChangeEmail}
            required
          />
        </div>

        <div className="info">
          <span>
            Te enviaremos un enlace de verificación al correo para cambiar tu contraseña.
          </span>
        </div>

        <div className="submit">
          <Button
            loading={loading}
            onClick={handleSubmit}
            big={true}
            alt={true}
            fullWidth={true}
            type="submit"
          >
            Envíame un enlace de verificación
          </Button>

          <div className="alt-actions">
            <Link href="/auth/login">
              <a title="Ir al login">Ir al login</a>
            </Link>
            <Link href="/auth/signup">
              <a title="Crear una cuenta">Crear una cuenta</a>
            </Link>
          </div>
        </div>
      </form>
      <style jsx>{`
        .info {
          font-size: 13px;
          text-align: center;
          margin: var(--edge-gap);
        }

        .alt-actions {
          font-size: 13px;
          margin-top: var(--edge-gap);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .alt-actions a {
          display: block;
          color: var(--edge-foreground);
          text-decoration: none;
        }
      `}</style>
    </>
  )
}

export default memo(RememberPasswordForm)
