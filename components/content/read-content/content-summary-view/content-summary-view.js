import Link from 'next/link'
import TagsField from '../fields/tags-field/tags-field'
import './content-summary-view.scss'

function getField(field, value) {
  switch (field.type) {
    case 'textarea':
      return <p>{value}</p>

    case 'img':
      return <img src={value} />

    case 'number':
      return <p>{value}</p>

    case 'file':
      return <p>{value}</p>

    case 'tags':
      return <TagsField tags={value} />

    default:
      return <p>{value}</p>
  }
}

export default function (props) {
  return (
    <div className="content-summary-view" >
      <div className="content-summary-content">
        {props.type.fields.map((field) => {
          return (
            <div className="field" key={field.name}>
              {getField(field, props.content[field.name])}
            </div>
          )
        })}
      </div>
      <Link href={`/content/${props.type.slug}/${props.content.slug}`}>
        <a title="Read more">Read more</a> 
      </Link>
    </div>
  )
}
