import '../styles/index.scss'

import withEdgeTheme, { EdgeThemeContext } from '../lib/contexts/edge-theme'

import { EdgeUserProvider } from '../lib/contexts/edge-user'
import { useContext } from 'react'

function MyApp({ Component, pageProps }) {
  const { mode } = useContext(EdgeThemeContext)

  return (
    <div id="app-container" className={mode}>
      <EdgeUserProvider>
        <Component {...pageProps} />
      </EdgeUserProvider>
    </div>
  )
}

export default withEdgeTheme(MyApp)
