import Link from 'next/link'
import config from '../../../../../lib/config'
import './tags-field.scss'

function Tag(props) {
  // Todo: maybe tags need to be managed differently
  const tag = config.tags.find((i) => i.slug === props.tag)

  return (
    <Link href={`/tag/${tag.slug}`}>
      <div className="tag">{tag.label.en}</div>
    </Link>
  )
}

export default function (props) {
  return (
    <div className="tags-list">
      {props.tags.map((tag) => {
        return <Tag tag={tag} />
      })}
    </div>
  )
}
