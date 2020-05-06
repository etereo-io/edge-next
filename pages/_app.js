import '../styles/index.scss'

import withEdgeTheme, {
  EdgeThemeContext,
} from '../lib/contexts/edge-theme'

import { useContext } from 'react'

function MyApp({ Component, pageProps }) {
  const { mode } = useContext(EdgeThemeContext)

  return (
    <div id="app-container" className={mode}>
      <Component {...pageProps} />
    </div>
  )
}

export default withEdgeTheme(MyApp)
