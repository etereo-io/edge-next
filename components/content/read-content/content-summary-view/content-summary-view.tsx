import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import { FIELDS } from '@lib/constants'
import Link from 'next/link'

export default function (props) {
  // Link to detail if it's not a summary
  const links = !!props.summary

  const shouldAddLink = (field) => {
    return (
      links &&
      field.type !== FIELDS.IMAGE &&
      field.type !== FIELDS.FILE &&
      field.type !== FIELDS.TAGS &&
      field.type !== FIELDS.VIDEO_URL
    )
  }

  return (
    <>
      <div className={`contentSummaryView ${props.className}`}>
        <div className="">
          {props.type.fields
            .filter((f) => f.name === props.type.publishing.title)
            .map((field) => {
              return (
                <h1
                  className="content-title"
                  key={`${field.name}-${props.content.id}`}
                >
                  {links && (
                    <Link
                      href={`/content/${props.type.slug}/${props.content.slug}`}
                    >
                      <a>{props.content[field.name]}</a>
                    </Link>
                  )}
                  {!links && props.content[field.name]}
                </h1>
              )
            })}

          {props.type.fields
            .filter((f) => !f.hidden)
            .filter((f) => f.name !== props.type.publishing.title)
            .map((field) => {
              return (
                <div key={`${field.name}-${props.content.id}`}>
                  {shouldAddLink(field) && (
                    <Link
                      href={`/content/${props.type.slug}/${props.content.slug}`}
                    >
                      <a title="Go to content detail">
                        <DynamicFieldView
                          field={field}
                          value={props.content[field.name]}
                          typeDefinition={props.type}
                        />
                      </a>
                    </Link>
                  )}
                  {!shouldAddLink(field) && (
                    <DynamicFieldView
                      field={field}
                      value={props.content[field.name]}
                      typeDefinition={props.type}
                    />
                  )}
                </div>
              )
            })}
        </div>
      </div>
      <style jsx>{`
        .content-title {
          font-size: 24px;
          line-height: 1;
          margin-bottom: var(--edge-gap);
          padding-right: var(--edge-gap);
        }

        @media all and (max-width: 720px) {
          .content-title {
            font-size: 21px;
            line-height: 1.25;
            padding-right: 0;
          }
        }

        a {
          text-decoration: none;
          color: var(--edge-link-color);
        }
      `}</style>
    </>
  )
}
