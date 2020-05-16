import '../styles/index.scss'

import * as gtag from '../lib/client/gtag'

import withEdgeTheme, { EdgeThemeContext } from '../lib/client/contexts/edge-theme'

import { EdgeUserProvider } from '../lib/client/contexts/edge-user'
import Router from 'next/router'
import { useContext } from 'react'

// Store navigation events on Google analytics
Router.events.on('routeChangeComplete', url => gtag.pageview(url))

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
