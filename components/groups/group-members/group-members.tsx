import Avatar from '@components/user/avatar/avatar'
import { UserType } from '@lib/types'

export default function GroupMembers({ members = [], visible = 3 }) {
  const membersVisible = members.slice(0, visible)
  const extraMembers = members.length > visible ? members.length - visible : 0

  return (
    <>
      <div className="group-members">
        <div className="members-wrapper">
          <div className="members-list">
            {membersVisible.map((member, index) => {
              return (
                <div className="member-item" key={`${member.id}-${index}`}>
                  <Avatar
                    radius={'100%'}
                    width={'32px'}
                    user={member as UserType}
                  />
                </div>
              )
            })}
            {extraMembers !== 0 && (
              <div className="member-item">
                <div className="extra-members">+{extraMembers}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .members-list {
          display: flex;
        }

        .member-item {
          border-radius: 100%;
          overflow: hidden;
          background: white;
          padding: 2px;
        }

        .member-item:not(:first-child) {
          margin-left: -12px;
          -webkit-mask: radial-gradient(
            circle 24px at -5px -50%,
            transparent 99%,
            #fff 100%
          );
          mask: radial-gradient(
            circle 24px at -5px -50%,
            transparent 99%,
            #fff 100%
          );
        }

        .extra-members {
          width: 32px;
          height: 32px;
          background: var(--edge-success);
          color: var(--edge-background);
          border-radius: 100%;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  )
}
