import { memo } from 'react'
import Head from 'next/head'

import config from '@lib/config'

function Head(props) {
  return (
    <Head>
      <title>
        {props.title} - {config.title}
      </title>
      <meta
        name="description"
        content={props.description || config.description}
      />
      {props.monetization && (
        <meta name="monetization" content={props.monetization} />
      )}
    </Head>
  )
}

export default memo(Head)