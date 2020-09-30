import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'

const defaultOptions = {
  html: false,
  linkify: true,
}


export default function(options: any = defaultOptions) {
  const md = MarkdownIt(options)
  md.use(emoji)
  return md
}
