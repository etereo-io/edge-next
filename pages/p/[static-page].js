import Layout from '@components/layout/normal/layout'
import Markdown from '@lib/markdown'
import MarkdownRead from '@components/generic/markdown-read/markdown-read'
import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
const md = Markdown()

const Page = ({ htmlString, data }) => {
  return (
    <Layout title={data.title} description={data.description}>
      <MarkdownRead htmlString={htmlString} />
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const filesEnglish = fs.readdirSync('static-pages/en')
  const filesSpanish = fs.readdirSync('static-pages/es')

  const pathsEn = filesEnglish.map((filename) => ({
    params: {
      ['static-page']: filename.replace('.md', ''),
    },
    locale: 'en'
  }))

  const pathsEs = filesSpanish.map((filename) => ({
    params: {
      ['static-page']: filename.replace('.md', ''),
    },
    locale: 'es'
  }))

  return {
    paths: [...pathsEn, ...pathsEs],
    fallback: false,
  }
}

export const getStaticProps = async ({ params, locale }) => {
  
  const slug = params['static-page']
  // TODO: handle missing route, error reading fs
  const markdownWithMetadata = fs
    .readFileSync(path.join('static-pages', locale, slug + '.md'))
    .toString()

  const parsedMarkdown = matter(markdownWithMetadata)

  return {
    props: {
      data: parsedMarkdown.data,
      htmlString: md.render(parsedMarkdown.content),
    },
  }
}

export default Page
