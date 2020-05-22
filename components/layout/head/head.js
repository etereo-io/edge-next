import Head from 'next/head'
import config from '@lib/config'

export default function (props) {
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
