import Button from '@components/generic/button/button'
import { GroupEntityType } from '@lib/types'
import { groupPermission } from '@lib/permissions'
import { memo } from 'react'
import { useUser } from '@lib/client/hooks'

interface Props {
  group: GroupEntityType
}
function GroupActions(props: Props) {
  const { group = {} as GroupEntityType } = props
  // Check permissions to edit
  const currentUser = useUser()

  const canEdit = groupPermission(currentUser.user, group.type, 'update', group)

  return (
    <>
      <div className={`content-actions`}>
        {canEdit && (
          <a
            className="edit-button"
            href={`/edit/group/${group.type}/${group.seo.slug}`}
          >
            <img
              style={{ width: '15px' }}
              src="/icons/icon-edit.svg"
              alt="edit"
            />
          </a>
        )}
      </div>

      <style jsx>{`
        .edit-button {
          border: var(--light-border);
          background-color: var(--edge-background);
          color: var(--edge-foreground);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          transition: 0.3s ease;
          position: relative;
          width: 36px;
          height: 36px;
          text-align: center;
          border-radius: 50%;
        }

        .edit-button img{
          display: inline-block;
        }
      `}</style>
    </>
  )
}

export default memo(GroupActions)
