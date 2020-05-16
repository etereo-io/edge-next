import DropDown from '../../../generic/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import SocialShare from '../../../generic/social-share/social-share'
import { hasPermission } from '../../../../lib/permissions'
import { useUser } from '../../../../lib/client/hooks'
import { FIELDS } from '../../../../lib/config/config-constants'
import DynamicFieldView from '../../../generic/dynamic-field/dynamic-field-view'
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
  const isContentOwner = user && user.id === props.content.author

  return (
    <>
      <div className={`contentSummaryView ${props.className}`}>
        {props.content.draft && (
          <div className="status">Draft - Not published</div>
        )}

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
                f.name !== props.type.publishing.title && f.type !== FIELDS.TAGS
            )
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
                        <DynamicFieldView
                          field={field}
                          value={props.content[field.name]}
                          contentType={props.type}
                        />
                      </a>
                    </Link>
                  )}
                  {!links && (
                    <DynamicFieldView
                      field={field}
                      value={props.content[field.name]}
                      contentType={props.type}
                    />
                  )}
                </div>
              )
            })}
          {props.type.fields
            .filter(
              (f) =>
                f.name !== props.type.publishing.title && f.type === FIELDS.TAGS
            )
            .map((field) => {
              return (
                <div
                  className="field"
                  key={`${field.name}-${props.content.id}`}
                >
                  <DynamicFieldView
                    field={field}
                    value={props.content[field.name]}
                    contentType={props.type}
                  />
                </div>
              )
            })}
        </div>
        <div className="bottomActions">
          <SocialShare shareUrl={shareUrl} />
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
        <div className="meta">
          <span className="created-at">{format(props.content.createdAt)}</span>
          {props.type.comments.enabled && typeof props.content.comments !== 'undefined' ? (
            <span className="comment-count">
              {props.content.comments} comments
            </span>
          ): null}
        </div>
      </div>
      <style jsx>{`
        .contentSummaryView {
          color: var(--empz-foreground);
          background: var(--empz-background);
          //border: var(--light-border);
          padding: var(--empz-gap);
          border-radius: var(--empz-radius);
          margin: 0 auto;
          width: 100%;
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

        .status {
          padding: 5px;
          font-size: 13px;
          background: var(--empz-warning);
          color: var(--empz-background);
        }

        h1,
        p {
          word-break: break-all;
        }

        .meta {
          color: var(--accents-5);
          font-size: 13px;
          margin-top: var(--empz-gap-half);
        }

        .meta .comment-count {
          padding-left: var(--empz-gap-half);
        }
      `}</style>
    </>
  )
}
