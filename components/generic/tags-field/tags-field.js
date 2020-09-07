import { memo } from 'react'
import Link from 'next/link'

function Tag(props) {
  return (
    <>
      <Link href={`/content/${props.type.slug}?tags=${props.tag.slug}`}>
        <a className="tag">{props.tag.label}</a>
      </Link>
      <style jsx>{`
        .tag {
          background: var(--edge-foreground);
          border-radius: 4px;
          color: var(--edge-background);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          margin-right: var(--edge-gap-half);
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

function TagsField({ tags = [], type = {} }) {
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
          margin-bottom: var(--edge-gap);
          margin-top: var(--edge-gap-double);
        }
      `}</style>
    </>
  )
}

export default memo(TagsField)