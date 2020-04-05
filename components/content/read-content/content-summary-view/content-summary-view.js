import Link from 'next/link'

export default function(props) {
  return (
    <div className="content-summary-view">
      <Link href={`content/${props.type.slug}/${props.content.id}`}>
        <div className="content-summary-content">
          {props.type.fields.map(field => {
            return (
              <div className="field">{field.name} : {props.content[field.name]}</div>
            )
          })}
        </div>
      </Link>
    </div>
  )
}