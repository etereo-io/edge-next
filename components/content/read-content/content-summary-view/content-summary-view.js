import DropDown from '../../../generic/dropdown-menu/dropdown-menu'
import Image from '../../../generic/image/image'
import Link from 'next/link'
import SocialShare from '../../../generic/social-share/social-share'
import TagsField from '../fields/tags-field/tags-field'
import { hasPermission } from '../../../../lib/permissions'
import { useUser } from '../../../../lib/hooks'
import {FIELDS } from '../../../../lib/config/config-constants'

function getField(field, value) {
  switch (field.type) {
    case FIELDS.TEXTAREA:
      return <p style={{ wordBreak: 'break-all'}}>{value}</p>

    case FIELDS.IMAGE:
      return value ? <div style={{display: 'flex', justifyContent: 'center'}} ><Image width={500} height={500} srcs={[value]} /> </div>: null

    case FIELDS.NUMBER:
      return <p>{value}</p>

    case FIELDS.FILE:
      return <p>{value}</p>

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
    <>
    <div className={`contentSummaryView ${props.className}`}>
      {props.content.draft && <div className='status'>
        Draft - Not published
        </div>}
      
      <div className="content-summary-content">
        {props.type.fields
          .filter((f) => f.name === props.type.publishing.title)
          .map((field) => {
            return (
              <div className='field' key={field.name}>
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
          .filter((f) => f.name !== props.type.publishing.title && f.type !== FIELDS.TAGS)
          .map((field) => {
            return (
              <div className='field' key={field.name}>
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
          .filter((f) => f.name !== props.type.publishing.title && f.type === FIELDS.TAGS)
          .map((field) => {
            return (
              <div className='field' key={field.name}>
                <TagsField tags={props.content[field.name]} />
              </div>
            )
          })}
      </div>
      <div className='bottomActions'>
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
      <style jsx>{
       `
      .contentSummaryView {
        color: var(--empz-foreground);
        background: var(--empz-background);
        border: 1px solid var(--accents-2);;
        padding: var(--empz-gap);
        border-radius: var(--empz-radius);
        max-width: 800px;
        margin: 0 auto;  
      }

      @media (max-width: 600px) {
        .contentSummaryView {
          padding: var(--empz-gap-half);
        }
      }
       
      a {
        text-decoration: none;
        color: var(--empz-link-color);
      }

      .field {
        margin: var(--empz-gap);
      }

      @media (max-width: 600px) {
        .field {
          margin: var(--empz-gap-half);
        }
      }

      .bottomActions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
      }

      .status {
        padding: 5px;
        font-size: 13px;
        background: var(--empz-warning);
        color: var(--empz-background);
      }

      h1, p {
        word-break: break-all;
      }
       ` 
      }</style>
    </>
  )
}
