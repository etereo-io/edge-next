import DropDown from '../../../generic/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import SocialShare from '../../../generic/social-share/social-share'
import { hasPermission } from '../../../../lib/permissions'
import { useUser } from '../../../../lib/client/hooks'
import { FIELDS } from '../../../../lib/config/config-constants'
import DynamicFieldView from '../../../generic/dynamic-field/dynamic-field-view'
import AuthorBox from '../../../user/author-box/author-box'
import { format } from 'timeago.js'

export default function (props) {
  const shareUrl =
    typeof window !== 'undefined'
      ? `${String(window.location)}/content/${props.type.slug}/${
          props.content.slug
        }`
      : ''
  const links = !!props.links

  const { user } = useUser()

  const hasEditPermission = hasPermission(user, [
    `content.${props.content.type}.admin`,
    `content.${props.content.type}.update`,
  ])

  const shouldAddLink = field => {
    return links && field.type !== FIELDS.IMAGE && field.type !== FIELDS.FILE && field.type !== FIELDS.TAGS && field.type !== FIELDS.VIDEO_URL
  }

  const isContentOwner = user && user.id === props.content.author

  const onClickComments = (ev) => {
    if ((props.canReadComments && props.content.comments) || props.canWriteComments) {
      props.onClickComments()
    }
  }

  return (
    <>
      
      <div className={`contentSummaryView ${props.className}`}>
        <div className="main-actions">
          {props.content.draft && (
            <div className="status">Draft - Not published</div>
          )}

          <div className="action-dropdown">
            <DropDown align={'right'}>
              <ul>
                {!isContentOwner && <li>Report</li>}
                <li>
                  <a
                    href={`mailto:?${JSON.stringify({
                      subject: 'Check this out',
                      body: shareUrl,
                    })}`}
                  >
                    Email
                  </a>
                </li>
                {(hasEditPermission || isContentOwner) && (
                  <li>
                    <Link
                      href={`/edit/${props.content.type}/${props.content.slug}`}
                    >
                      <a>Edit</a>
                    </Link>
                  </li>
                )}
              </ul>
            </DropDown>
          </div>
        </div>
        <div className="author-info">
          <AuthorBox user={props.content ? props.content.user : null } />
        </div>
        <div className="content-summary-content">
          {props.type.fields
            .filter((f) => f.name === props.type.publishing.title)
            .map((field) => {
              return (
                <div
                  className="field"
                  key={`${field.name}-${props.content.id}`}
                >
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
            .filter(
              (f) =>
                f.name !== props.type.publishing.title
            )
            .map((field) => {
              return (
                <div
                  className="field"
                  key={`${field.name}-${props.content.id}`}
                >
                  {shouldAddLink(field) && (
                    <Link
                      href={`/content/${props.type.slug}/${props.content.slug}`}
                    >
                      <a>
                        <DynamicFieldView
                          field={field}
                          value={props.content[field.name]}
                          contentType={props.type}
                        />
                      </a>
                    </Link>
                  )}
                  {!shouldAddLink(field) && (
                    <DynamicFieldView
                      field={field}
                      value={props.content[field.name]}
                      contentType={props.type}
                    />
                  )}
                </div>
              )
            })}
          
        </div>
        <div className="meta">
          <div className="post-details">
            <span className="created-at">{format(props.content.createdAt)}</span>
            {props.type.comments.enabled && props.canReadComments && typeof props.content.comments !== 'undefined' ? (
              <span className="comment-count" onClick={onClickComments}>
                {props.content.comments === 0 && props.canWriteComments ? 'Add a comment' : `${props.content.comments} comments`}
              </span>
            ): null}
          </div>
          <SocialShare shareUrl={shareUrl} />
        </div>
      </div>
      <style jsx>{`
        /*.contentSummaryView {
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          color: var(--empz-foreground);
          background: var(--empz-background);
          //border: var(--light-border);
          padding: var(--empz-gap);
          border-radius: var(--empz-radius);
          margin: 0 auto;
          width: 100%;
        }*/

        @media (max-width: 600px) {
          .contentSummaryView {
            padding: var(--empz-gap-half);
          }
        }

        .content-summary-content{
          padding-right: var(--empz-gap-double);
        }

        a {
          text-decoration: none;
          color: var(--empz-link-color);
        }

        .field {
          margin: var(--empz-gap) 0;
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

        .main-actions{
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--empz-gap);
          width: 100%;
        }

        .status {
          background: var(--accents-2);
          border-radius: 4px;
          color: var(--empz-foreground);
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          padding: 4px 8px;
          text-align: center;
          text-transform: uppercase;
          width: fit-content;
        }

        .action-dropdown{
          margin-left: auto;
        }

        .meta {
          color: var(--accents-5);
          font-size: 13px;
          margin-top: var(--empz-gap-half);
        }

        .meta .comment-count {
          cursor: pointer;
          padding-left: var(--empz-gap-half);
        }

        h1{
          font-size: 24px;
        }
        h1:first-letter{
          text-transform: uppercase;
        }
        .meta{
          align-items: center;
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </>
  )
}
