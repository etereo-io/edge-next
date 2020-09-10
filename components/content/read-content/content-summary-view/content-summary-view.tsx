import { memo, useCallback, useMemo } from 'react'
import Link from 'next/link'

import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import { FIELDS } from '@lib/constants'
import { cypheredFieldPermission } from '@lib/permissions'

function ContentSummaryView(props) {
  // Link to detail if it's not a summary
  const links = useMemo(() => !!props.summary, [props.summary])

  const shouldAddLink = useCallback(
    (field) => {
      return (
        links &&
        ![FIELDS.IMAGE, FIELDS.FILE, FIELDS.TAGS, FIELDS.VIDEO_URL].includes(
          field.type
        )
      )
    },
    [links]
  )

  const permittedFields = useMemo(
    () =>
      props.type.fields.filter((field) => {
        if (!field.cypher || !field.cypher.enabled) {
          return true
        }

        return (
          cypheredFieldPermission(
            props.user,
            'content',
            props.type.slug,
            field.name
          ) || props.content?.author === props.user?.id
        )
      }),
    [props.user, props.type]
  )

  return (
    <>
      <div className={`contentSummaryView ${props.className}`}>
        <div className="">
          {permittedFields
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

          {permittedFields
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
          font-size: 21px;
          line-height: 1;
          margin-bottom: var(--edge-gap);
          padding-right: var(--edge-gap);
        }

        @media all and (max-width: 720px) {
          .content-title {
            font-size: 18px;
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

export default memo(ContentSummaryView)
