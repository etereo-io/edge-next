
import './link-list.scss'

export default function(props) {
  return (
    <div className="link-list">
      <ul>
        {props.links.map(i => <li>{i}</li>)}
      </ul>
    </div>
  )
}