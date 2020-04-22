import DropDown from '../../../generic/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import SocialShare from '../../../generic/social-share/social-share'
import TagsField from '../fields/tags-field/tags-field'
import styles from './content-summary-view.module.scss'

function getField(field, value) {
  switch (field.type) {
    case 'textarea':
      return <p>{value}</p>

    case 'img':
      return <img className={styles.img} src={value} />

    case 'number':
      return <p>{value}</p>

    case 'file':
      return <p>{value}</p>

    case 'tags':
      return 

    default:
      return <p>{value}</p>
  }
}

export default function (props) {
  const shareUrl = typeof window !== 'undefined' ? `${String(window.location)}/content/${props.type.slug}/${props.content.slug}`: ''

  return (
    <div className={`${styles.contentSummaryView} ${props.className}`}>
      <div className="content-summary-content">
        {props.type.fields.filter(f => !!f.title).map((field) => {
          return (
            <div className={styles.field} key={field.name}>
              <Link href={`/content/${props.type.slug}/${props.content.slug}`}><a><h1>{props.content[field.name]}</h1></a></Link>
            </div>
          )
        })}
        {props.type.fields.filter(f => !f.title && f.type !== 'tags').map((field) => {
          return (
            <div className={styles.field} key={field.name}>
              <Link href={`/content/${props.type.slug}/${props.content.slug}`}><a>{getField(field, props.content[field.name])}</a></Link>
            </div>
          )
        })}
        {props.type.fields.filter(f => !f.title && f.type === 'tags').map((field) => {
          return (
            <div className={styles.field} key={field.name}>
              <TagsField tags={props.content[field.name]} />
            </div>
          )
        })}
      </div>
      <div className={styles.bottomActions}>
        <SocialShare shareUrl={shareUrl} />
        <DropDown>
          <ul>
            <li>Report</li>
            <li>Email</li>
          </ul>
        </DropDown>

      </div>
      
    </div>
  )
}
