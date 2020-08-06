import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import { FIELDS } from '@lib/constants'
import GroupMembers from '@components/groups/group-members/group-members'
import Link from 'next/link'

export default function(props) {
  const shouldAddLink = (field) => {
    return (
      props.linkToDetail &&
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
          <div className="group-top-section">
            {props.type.fields
              .filter((f) => f.name === props.type.publishing.title)
              .map((field) => {
                return (
                  <h1
                    className="content-title"
                    key={`${field.name}-${props.group.id}`}
                  >
                    {props.linkToDetail && (
                      <Link
                        href={`/group/${props.type.slug}/${props.group.slug}`}
                      >
                        <a>{props.group[field.name]}</a>
                      </Link>
                    )}
                    {!props.linkToDetail && props.group[field.name]}
                  </h1>
                )
              })}

            { props.group.members && <GroupMembers members={props.group.members} visible={3} />}
          </div>

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
        .group-top-section {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: var(--edge-gap);
          justify-content: space-between;
          align-items: center;
        }

        .content-title {
          font-size: 24px;
          line-height: 1;
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
