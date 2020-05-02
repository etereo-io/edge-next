import DropDown from '../../../generic/dropdown-menu/dropdown-menu'
import Image from '../../../generic/image/image'
import Link from 'next/link'
import SocialShare from '../../../generic/social-share/social-share'
import TagsField from '../fields/tags-field/tags-field'
import { hasPermission } from '../../../../lib/permissions'
import styles from './content-summary-view.module.scss'
import { useUser } from '../../../../lib/hooks'

function getField(field, value) {
  switch (field.type) {
    case 'textarea':
      return <p>{value}</p>

    case 'img':
      return value ? <div style={{display: 'flex', justifyContent: 'center'}} ><Image width={500} height={500} srcs={[value]} /> </div>: null

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
  const shareUrl =
    typeof window !== 'undefined'
      ? `${String(window.location)}/content/${props.type.slug}/${
          props.content.slug
        }`
      : ''
  const links = !!props.links


  const { user } = useUser({
    userId: 'me'
  })

  const hasEditPermission = hasPermission(
    user,
    [`content.${props.content.type}.admin`, `content.${props.content.type}.update`],
  )
  const isContentOwner = user && user.id === props.content.author


  return (
    <div className={`${styles.contentSummaryView} ${props.className}`}>
      <div className="content-summary-content">
        {props.type.fields
          .filter((f) => !!f.title)
          .map((field) => {
            return (
              <div className={styles.field} key={field.name}>
                {links && (
                  <Link
                    href={`/content/${props.type.slug}/${props.content.slug}`}
                  >
                    <a>
                      <h1>{props.content[field.name]}</h1>
                    </a>
                  </Link>
                )}
                {!links && <h1>{props.content[field.name]}</h1>}
              </div>
            )
          })}
        {props.type.fields
          .filter((f) => !f.title && f.type !== 'tags')
          .map((field) => {
            return (
              <div className={styles.field} key={field.name}>
                {links && (
                  <Link
                    href={`/content/${props.type.slug}/${props.content.slug}`}
                  >
                    <a>{getField(field, props.content[field.name])}</a>
                  </Link>
                )}
                {!links && getField(field, props.content[field.name])}
              </div>
            )
          })}
        {props.type.fields
          .filter((f) => !f.title && f.type === 'tags')
          .map((field) => {
            return (
              <div className={styles.field} key={field.name}>
                <TagsField tags={props.content[field.name]} />
              </div>
            )
          })}
      </div>
      <div className={styles.bottomActions}>
        <SocialShare shareUrl={shareUrl} />
        <DropDown align={'right'}>
          <ul>
            {!isContentOwner && <li>Report</li>}
            <li><a href={`mailto:?${JSON.stringify({subject: 'Check this out', body: shareUrl})}`}>Email</a></li>
            {(hasEditPermission || isContentOwner) && <li><Link href={`/edit/${props.content.type}/${props.content.slug}`}><a>Edit</a></Link></li>}
          </ul>
        </DropDown>
      </div>
    </div>
  )
}
