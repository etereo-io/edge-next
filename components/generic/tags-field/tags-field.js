import Link from 'next/link'

function Tag(props) {
  return (
    <>
      <Link href={`/content/${props.type.slug}?tags=${props.tag.slug}`}>
        <a className="tag">{props.tag.label}</a>
      </Link>
      <style jsx>{`
        .tag {
          padding: 5px;
          background: var(--empz-foreground);
          border-radius: 5px;
          color: var(--empz-background);
          margin-right: 5px;
          margin-bottom: 5px;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

export default function ({ tags = [], type = {} }) {
  return (
    <>
      <div className="tags-field">
        {(tags || []).map((tag) => {
          return <Tag tag={tag} key={tag.slug} type={type} />
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
