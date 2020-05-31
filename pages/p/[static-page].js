import Layout from '@components/layout/normal/layout'
import MarkdownIt from 'markdown-it'
import MarkdownRead from '@components/generic/markdown-read/markdown-read'
import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const Page = ({ htmlString, data }) => {
  return (
    <Layout title={data.title} description={data.description}>
      <MarkdownRead htmlString={htmlString} />
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync('static-pages')

  const paths = files.map((filename) => ({
    params: {
      ['static-page']: filename.replace('.md', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
  })

  const slug = params['static-page']
  const markdownWithMetadata = fs
    .readFileSync(path.join('static-pages', slug + '.md'))
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
