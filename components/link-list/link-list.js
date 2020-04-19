import Link from 'next/link'
import './link-list.scss'

export default function(props) {
  return (
    <div className="link-list">
      <ul>
        {props.links.map(i => <li key={i.title}>
            <Link href={i.link}>
              <a title={i.title}>{i.title}</a>
            </Link>
          </li>)}
      </ul>
    </div>
  )
}