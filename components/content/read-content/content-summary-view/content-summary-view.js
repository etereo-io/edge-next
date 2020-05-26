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
  // Link to detail if it's not a summary
  const links = !!props.summary

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
        <header className="edge-item-card-header">
          {props.content.draft && <div className="status">Draft</div>}

          {!props.content.draft && (
            <div className="author-info">
              <AuthorBox user={props.content ? props.content.user : null} />
            </div>
          )}

          <div className="edge-item-card-actions">
            <button className="edge-button has-icon check">Following</button>
            <div className="edge-button-icon-counter">
              <small className="edge-button-counter">21</small>
              <button className="edge-button-icon">
                <img src="/refactor/icon-heart.svg" />
              </button>
            </div>
            {(hasEditPermission || isContentOwner) && (
              <Link href={`/edit/${props.content.type}/${props.content.slug}`}>
                <a className="edge-button-icon edit-content">
                  <img src="/refactor/icon-edit.svg" />
                </a>
              </Link>
            )}
          </div>
        </header>

        <div className="edge-item-card-content">
          {props.type.fields
            .filter((f) => f.name === props.type.publishing.title)
            .map((field) => {
              return (
                <h6
                  className="edge-item-card-title"
                  key={`${field.name}-${props.content.id}`}
                >
                  {links && (
                    <Link
                      href={`/content/${props.type.slug}/${props.content.slug}`}
                    >
                      <a>{props.content[field.name]}</a>
                    </Link>
                  )}
                  {!links && (
                    <h6 className="edge-item-card-title">
                      {props.content[field.name]}
                    </h6>
                  )}
                </h6>
              )
            })}

          {/*
          <div className="edge-item-card-content-inner">
            <p className="edge-item-card-text">Un texto</p>

            <img
              className="edge-item-card-image"
              src="https://storage.googleapis.com/edge-next/post-images/1589797092792-Bitmap.jpg"
            />
          </div>
        */}

          {props.type.fields
            .filter((f) => !f.hidden)
            .filter((f) => f.name !== props.type.publishing.title)
            .map((field) => {
              return (
                <div
                  className="edge-item-card-content-inner"
                  key={`${field.name}-${props.content.id}`}
                >
                  {shouldAddLink(field) && (
                    <Link
                      href={`/content/${props.type.slug}/${props.content.slug}`}
                    >
                      <a title="Go to content detail">
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
        <footer className="edge-item-card-footer">
          <ul className="edge-item-card-stats">
            <li className="edge-item-card-stats-item">
              <b>{format(props.content.createdAt)}</b>
              <span>created at</span>
            </li>

            <li className="edge-item-card-stats-item">
              <b>
                {props.type.comments.enabled &&
                props.canReadComments &&
                typeof props.content.comments !== 'undefined' ? (
                  <span className="comment-count" onClick={onClickComments}>
                    {props.content.comments === 0 && props.canWriteComments
                      ? 'Add a comment'
                      : `${props.content.comments} comments`}
                  </span>
                ) : null}
              </b>
              <span>comments</span>
            </li>
          </ul>

          <SocialShare shareUrl={shareUrl} />
        </footer>
      </div>
      <style jsx>{`
        .edge-item-card-footer {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .edge-item-card-stats {
          display: flex;
        }

        .edge-item-card-stats-item {
          font-size: 13px;
          list-style: none;
          margin-right: var(--edge-gap);
        }

        .edge-item-card {
          background-color: var(--edge-background);
          border-radius: var(--edge-gap);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: var(--edge-gap);
          padding: var(--edge-gap-medium);
          position: relative;
        }
        @media all and (max-width: 720px) {
          .edge-item-card-footer{
            display: flex;
            flex-flow: column;
          }

          .edge-item-card {
            padding: var(--edge-gap);
          }

          .edge-item-card-stats-item {
            display: flex;
            flex-flow: column;
            font-size: 12px;
          }
        }

        .edge-item-card-stats-item b {
          margin-right: var(--edge-gap-half);
        }

        .edge-item-card-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        @media all and (max-width: 460px) {
          .edge-button.has-icon {
            background-position: 50%;
            height: $edge-gap-triple;
            padding-left: 0;
            text-indent: -9999px;
            width: $edge-gap-triple;
          }
        }

        .edge-item-card-actions {
          align-items: center;
          display: flex;
        }

        .edge-button-icon-counter {
          margin-left: var(--edge-gap);
        }

        .edge-button-icon-counter {
          align-items: center;
          display: flex;
        }

        .edge-button-counter {
          font-size: 13px;
          margin-right: var(--edge-gap-half);
        }

        .edge-item-card-content {
          margin: var(--edge-gap-double) 0 0;
        }

        .edge-item-card-title {
          font-size: 24px;
          line-height: 1;
          margin-bottom: var(--edge-gap);
          padding-right: var(--edge-gap);
        }

        .edge-item-card-text {
          color: var(--accents-4);
          font-size: 16px;
          line-height: 1.5;
          padding-right: var(--edge-gap);
        }

        @media all and (max-width: 720px) {
          .edge-item-card-title {
            font-size: 21px;
            line-height: 1.25;
            padding-right: 0;
          }
          .edge-item-card-text {
            font-size: 14px;
            padding-right: 0;
          }
        }

        @media (max-width: 600px) {
          .contentSummaryView {
            padding: 0;
          }
        }

        .content-summary-content {
          padding-right: var(--edge-gap-double);
        }

        @media all and (max-width: 720px) {
          .content-summary-content {
            padding-right: 0;
          }
        }

        a {
          text-decoration: none;
          color: var(--edge-link-color);
        }

        .field {
          margin: var(--edge-gap) 0;
        }

        @media (max-width: 600px) {
          .field {
            //margin: var(--edge-gap-half);
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
          margin-bottom: var(--edge-gap);
          width: 100%;
        }

        .status {
          background: var(--accents-2);
          border-radius: 4px;
          color: var(--edge-foreground);
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
          margin-left: var(--edge-gap-half);
        }

        .meta {
          color: var(--accents-5);
          font-size: 13px;
          margin-top: var(--edge-gap-half);
        }

        .meta .comment-count {
          cursor: pointer;
          padding-left: var(--edge-gap-half);
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
      `}</style>
    </>
  )
}
