import '../styles/index.scss'

import withEmpiezaTheme, { EmpiezaThemeContext } from '../lib/contexts/empieza-theme'

import { useContext } from 'react'

function MyApp({ Component, pageProps }) {
  const { mode } = useContext(
    EmpiezaThemeContext
  )

  return <div className={mode}>
    <Component {...pageProps} />
  </div>
}

export default withEmpiezaTheme(MyApp)