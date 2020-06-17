import Link from 'next/link'
import { FIELDS } from '@lib/config/config-constants'
import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'

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
      <div className={`group-summary-view ${props.className}`}>
        <div className="">
          {props.type.fields
            .filter((f) => f.name === props.type.publishing.title)
            .map((field) => {
              return (
                <h1
                  className="content-title"
                  key={`${field.name}-${props.group.id}`}
                >
                  {links && (
                    <Link
                      href={`/group/${props.type.slug}/${props.group.slug}`}
                    >
                      <a>{props.group[field.name]}</a>
                    </Link>
                  )}
                  {!links && props.group[field.name]}
                </h1>
              )
            })}

          {props.type.fields
            .filter((f) => !f.hidden)
            .filter((f) => f.name !== props.type.publishing.title)
            .map((field) => {
              return (
                <div key={`${field.name}-${props.group.id}`}>
                  {shouldAddLink(field) && (
                    <Link
                      href={`/group/${props.type.slug}/${props.group.slug}`}
                    >
                      <a title="Go to item detail">
                        <DynamicFieldView
                          field={field}
                          value={props.group[field.name]}
                          typeDefinition={props.type}
                        />
                      </a>
                    </Link>
                  )}
                  {!shouldAddLink(field) && (
                    <DynamicFieldView
                      field={field}
                      value={props.group[field.name]}
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
