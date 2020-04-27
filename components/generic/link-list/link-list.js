import Link from 'next/link'
import styles from './link-list.module.scss'

export default function (props) {
  return (
    <div className={styles.linkList}>
      <ul>
        {props.links.map((i) => (
          <li key={i.title}>
            <Link href={i.link}>
              <a title={i.title}>{i.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
