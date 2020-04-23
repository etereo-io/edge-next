import Link from 'next/link'
import config from '../../../../../lib/config'

function Tag(props) {
  // Todo: maybe tags need to be managed differently
 
  const tag = config.tags.initialTags.find((i) => i.slug === props.tag)

  return (
    <>
      <Link href={`/tag/${tag.slug}`}>
        <a className='tag'>{tag.label}</a>
      </Link>
    <style jsx>{`
    .tag {
      padding: 5px;
      background: var(--empz-background);
      border-radius: 5px;
      color: var(--empz-foreground);
      margin: 5px;
      cursor: pointer;
    }
    `}</style>
    </>
  )
}

export default function (props) {
  return (
    <>
    <div className="tags-field">
      {props.tags.map((tag) => {
        return <Tag tag={tag} key={tag.slug} />
      })}
    </div>
    <style jsx>{`
      .tags-field {
        display: flex;
        flex-wrap: wrap;
      }
    `}</style>
    </>
  )
}
