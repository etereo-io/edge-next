
import './content-detail-view.scss'

export default function(props) {
  return (
    <div className="content-detail-view">
        <div className="content-detail-content">
          {props.type.fields.map(field => {
            return (
              <div className="field">{field.name} : {props.content[field.name]}</div>
            )
          })}
        </div>
      
    </div>
  )
}