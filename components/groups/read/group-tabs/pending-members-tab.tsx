import React, { memo, useCallback, useContext, useState } from 'react'

import { MemberType } from '@lib/types'
import fetch from '@lib/fetcher'
import { UPDATE_GROUP_USER_ACTIONS } from '@lib/constants'
import API from '@lib/api/api-endpoints'
import GroupContext from '@components/groups/context/group-context'
import { METHODS, TYPES, UsersList } from '@components/groups/users-list'

interface Props {
  roles: Array<{ value: string | number; label: string }>
  users: Array<MemberType>
  groupId: string
  groupType: string
}

function PendingMembersTab({ roles, users, groupId, groupType }: Props) {
  const { onSubmitEvent } = useContext(GroupContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const submitUser = useCallback(
    (user: MemberType | string, method: METHODS) => {
      setIsLoading(true)

      const id = typeof user === 'string' ? user : user.id
      let url = `${API.groups[groupType]}/${groupId}/users/${id}?field=id`

      if (method === METHODS.UPDATE) {
        url += `&action=${UPDATE_GROUP_USER_ACTIONS.APPROVE}`
      }

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
        .then((data) => {
          setIsError(false)
          onSubmitEvent(data)
        })
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false))
    },
    [setIsLoading, setIsError, onSubmitEvent]
  )

  return (
    <>
      <UsersList
        loading={isLoading}
        roles={roles}
        users={users}
        onChange={submitUser}
        type={TYPES.PENDING_MEMBERS}
      />
      {isError && <div>Something went wrong</div>}
      {isLoading && <div>Loading...</div>}
    </>
  )
}

export default memo(PendingMembersTab)
