import React, { createContext, useContext } from 'react'

import { CookiesContext } from './cookies-context'
import { GA_TRACKING_ID } from '@lib/client/gtag'
import Head from 'next/head'

export const AnalyticsContext = createContext({})


export const AnalyticsProvider = ({ children }: any) => {
  const { cookies } = useContext(CookiesContext)


  return (
    <AnalyticsContext.Provider value={{}}>
      <>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {cookies.statistics && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
                }}
              />
            </>
          )}
        </Head>
        {children}
      </>
    </AnalyticsContext.Provider>
  )
}
