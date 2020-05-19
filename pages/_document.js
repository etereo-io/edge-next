import Document, { Head, Html, Main, NextScript } from 'next/document'

import { GA_TRACKING_ID } from '../lib/client/gtag'
import config from '../lib/config'

// A custom document is required in Next.js to set the `lang` attribute on the
// `<html>` tag.
// We hope to provide a configuration option for this in the future (RFC for
// built-in internationalization coming soon).

class MyDocument extends Document {
  render() {
    // `<Html>`, `<Head>`, `<Main>`, and `<NextScript>` are all required to be
    // used. You cannot use the normal `<html>`, `<head>`, et al.
    //
    // Next.js injects additional attributes and/or content to make your
    // application function as expected.
    //
    // https://nextjs.org/docs/advanced-features/custom-document
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content={config.title} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={config.title} />
          <meta name="description" content={config.description} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/icons/favicon.ico" />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
