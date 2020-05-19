import DropDown from '../../../generic/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import SocialShare from '../../../generic/social-share/social-share'
import { hasPermission } from '@lib/permissions'
import { useUser } from '@lib/client/hooks'
import { FIELDS } from '@lib/config/config-constants'
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

  const shouldAddLink = (field) => {
    return (
      links &&
      field.type !== FIELDS.IMAGE &&
      field.type !== FIELDS.FILE &&
      field.type !== FIELDS.TAGS &&
      field.type !== FIELDS.VIDEO_URL
    )
  }

  const isContentOwner = user && user.id === props.content.author

  const onClickComments = (ev) => {
    if (
      (props.canReadComments && props.content.comments) ||
      props.canWriteComments
    ) {
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

          {!props.content.draft && (
            <div className="author-info">
              <AuthorBox user={props.content ? props.content.user : null} />
            </div>
          )}

          <div className="content-options">
            <div className="reaction-wr">
              <span className="reaction-counter">21</span>
              <div className="reaction-like-wr">
                <svg
                  className="reaction-like"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-10 0 532 476"
                >
                  <defs />
                  <path
                    fill="#FFF"
                    fill-rule="nonzero"
                    stroke="#EAEAEA"
                    stroke-width="20"
                    d="M464.0307 51.3565C439.425 24.6693 405.7258 10 368.9727 10c-27.328 0-52.2457 8.6013-74.3307 25.6792-11.2483 8.7012-21.4801 19.386-30.5391 31.9116l-8.1034 11.2043-8.1027-11.2048c-9.056-12.523-19.2916-23.2106-30.542-31.9105C195.273 18.6015 170.3556 10 143.0273 10c-36.7542 0-70.457 14.67-95.0612 41.3557C23.5206 77.8761 10 114.2588 10 153.8711c0 40.8115 15.2423 78.2532 48.4806 118.361 14.167 17.0935 31.8873 35.1252 54.8934 56.2032 17.8482 16.3524 33.3202 29.7605 71.011 61.8797 27.6543 23.5696 41.2316 35.2205 58.4109 50.2407 3.6525 3.1992 8.3382 4.96 13.2041 4.96 4.8626 0 9.5525-1.7612 13.2022-4.9574 17.1403-14.9893 30.4533-26.4135 58.425-50.2555 37.7107-32.1353 53.159-45.5223 71.0038-61.871 23.006-21.0773 40.7256-39.1086 54.8923-56.2037C486.7596 232.1265 502 194.6852 502 153.8671c0-39.6099-13.5215-75.9917-37.9693-102.5106zm0 0l-.0002-.0002.0003.0004-.0001-.0002z"
                  />
                </svg>
              </div>
            </div>

            {(hasEditPermission || isContentOwner) && (
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

                    <li>
                      <Link
                        href={`/edit/${props.content.type}/${props.content.slug}`}
                      >
                        <a>Edit</a>
                      </Link>
                    </li>
                  </ul>
                </DropDown>
              </div>
            )}
          </div>
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
            .filter((f) => f.name !== props.type.publishing.title)
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
            <span className="created-at">
              {format(props.content.createdAt)}
            </span>
            {props.type.comments.enabled &&
            props.canReadComments &&
            typeof props.content.comments !== 'undefined' ? (
              <span className="comment-count" onClick={onClickComments}>
                {props.content.comments === 0 && props.canWriteComments
                  ? 'Add a comment'
                  : `${props.content.comments} comments`}
              </span>
            ) : null}
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

        .content-summary-content {
          padding-right: var(--empz-gap-double);
        }

        @media all and (max-width: 720px) {
          .content-summary-content {
            padding-right: 0;
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

        .main-actions {
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

        .action-dropdown {
          margin-left: var(--empz-gap-half);
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

        h1 {
          font-size: 24px;
        }
        h1:first-letter {
          text-transform: uppercase;
        }
        .meta {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .content-options {
          display: flex;
        }

        .content-options .reaction-wr {
          align-items: center;
          display: flex;
        }

        .content-options .reaction-counter {
          color: var(--accents-3);
          margin-right: 8px;
          font-size: 12px;
        }

        .reaction-like-wr {
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          height: 32px;
          position: relative;
          width: 32px;
        }

        .reaction-like-wr:before,
        .reaction-like-wr:after {
          border: 2px solid var(--accents-2);
          box-sizing: content-box;
          content: '';
          position: absolute;
          height: 100%;
          width: 100%;
          border-radius: 50%;
          pointer-events: none;
        }

        .reaction-like-wr:after {
          border-color: var(--empz-alert);
          opacity: 0;
          transition: 0.35s ease;
        }

        .content-options .reaction-like {
          transition: 0.35s ease;
          width: 16px;
        }

        .content-options .reaction-like path {
          fill: var(--accents-3);
          transition: 0.35s ease;
        }

        .content-options .reaction-like-wr:hover .reaction-like path {
          fill: var(--empz-alert);
          stroke: var(--empz-alert);
        }

        .content-options .reaction-like-wr:hover .reaction-like {
          transform: scale(0.8);
        }

        .content-options .reaction-like-wr:hover:after {
          animation: reactionLikeAfter 0.35s ease-in-out forwards;

          @keyframes reactionLikeAfter {
            10% {
              opacity: 1;
            }

            100% {
              opacity: 0;
              border-width: 6px;
            }
          }
        }
      `}</style>
    </>
  )
}
