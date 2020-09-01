import React, { memo } from 'react'

import Avatar from '@components/user/avatar/avatar'
import { UserType } from '@lib/types'

type Props = {
  title: string
  users?: UserType[]
  numberItems?: number
}

function InteractionUsers({ title, users = [], numberItems = 3 }: Props) {
  const usersVisible = users.slice(0, numberItems)
  const extraUsers = users.length > numberItems ? users.length - numberItems : 0

  return (
    <>
      {!!usersVisible.length && (
        <>
          <div className="users-title">{title}</div>
          <div className="users-list">
            {usersVisible.map((user, index) => {
              return (
                <div className="user-item" key={`${user.id}-${index}`}>
                  <Avatar radius="100%" width="25px" user={user} />
                </div>
              )
            })}
            {!!extraUsers && (
              <div className="user-item">
                <div className="extra-users">+ {extraUsers}</div>
              </div>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .users-list {
          display: flex;
        }

        .user-item {
          border-radius: 100%;
          overflow: hidden;
          background: white;
          padding: 2px;
        }

        .user-item:not(:first-child) {
          margin-left: -25px;
          -webkit-mask: radial-gradient(
            circle 30px at -5px -50%,
            transparent 99%,
            #fff 100%
          );
          mask: radial-gradient(
            circle 30px at -5px -50%,
            transparent 99%,
            #fff 100%
          );
        }

        .extra-users {
          width: 25px;
          height: 25px;
          background: var(--edge-success);
          color: var(--edge-background);
          border-radius: 100%;
          font-size: 15px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default memo(InteractionUsers)
