import React, { memo, useCallback, useContext, useState } from 'react'

import fetch from '@lib/fetcher'
import API from '@lib/api/api-endpoints'
import { MemberType } from '@lib/types'
import Button from '@components/generic/button/button'
import { TYPES, UsersList } from '@components/groups/users-list'
import GroupContext from '@components/groups/context/group-context'

interface Props {
  roles: Array<{ value: string | number; label: string }>
  users: Array<MemberType>
  groupId: string
  groupType: string
}

function MembersTab({ roles, users, groupId, groupType }: Props) {
  const [items, setItems] = useState(users)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const { onSubmitEvent } = useContext(GroupContext)

  const handleChange = useCallback((values) => setItems(values), [setItems])
  const submitMembers = useCallback(() => {
    setIsLoading(true)

    fetch(`${API.groups[groupType]}/${groupId}/users?field=id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
      .then(data => {
        setIsError(false)
        onSubmitEvent(data)
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  }, [items])

  return (
    <>
      <UsersList
        loading={isLoading}
        roles={roles}
        users={users}
        onChange={handleChange}
        type={TYPES.MEMBERS}
      />
      <Button loading={isLoading} onClick={submitMembers}>
        Save changes
      </Button>
      {isError && <div>Something went wrong</div>}
    </>
  )
}

export default memo(MembersTab)
