import Link from 'next/link'

function Tag(props) {
  return (
    <>
      <Link href={`/content/${props.type.slug}?tags=${props.tag.slug}`}>
        <a className="tag">{props.tag.label}</a>
      </Link>
      <style jsx>{`
        .tag {
          background: var(--empz-foreground);
          border-radius: 4px;
          color: var(--empz-background);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          margin-bottom: var(--empz-gap);
          margin-right: var(--empz-gap-half);
          padding: 4px 8px;
          text-align: center;
          text-transform: uppercase;
          text-decoration: none;
          width: fit-content;
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
