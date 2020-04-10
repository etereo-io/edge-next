import Link from 'next/link'
import './content-summary-view.scss'

export default function(props) {
  return (
    <div className="content-summary-view">
        <div className="content-summary-content">
          {props.type.fields.map(field => {
            return (
              <div className="field">{field.name} : {props.content[field.name]}</div>
            )
          })}
        </div>
      <Link href={`/content/${props.type.slug}/${props.content.slug}`}>Read more </Link>
    </div>
  )
}