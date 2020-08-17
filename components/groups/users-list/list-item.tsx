import React, { memo, useCallback } from 'react'

import { TableCellBody, TableRowBody } from '@components/generic/table/table'
import Button from '@components/generic/button/button'
import { MemberType } from '@lib/types'

import { TYPES } from './users-list'

interface Props {
  user: MemberType
  roles: Array<{ value: string | number; label: string }>
  setUserRole: (id, value) => void
  removeUser: (item) => void
  approveUser: (item) => void
  type: TYPES
  loading: boolean
}

function ListItem({
  roles,
  user: { roles: userRoles, username, email, id },
  user,
  setUserRole,
  removeUser,
  approveUser,
  type,
  loading,
}: Props) {
  const [role] = userRoles

  const handleRemoveUser = useCallback(() => {
    removeUser(id)
  }, [removeUser, id])
  const handleChangeRole = useCallback(
    (event) => {
      setUserRole(id, event.target.value)
    },
    [setUserRole, id]
  )
  const handleApproveUser = useCallback(() => {
    approveUser(user)
  }, [approveUser, user])

  return (
    <TableRowBody>
      <TableCellBody>{username || email}</TableCellBody>
      <TableCellBody>
        <select
          className="select-role"
          value={role}
          onChange={handleChangeRole}
          disabled={loading}
        >
          {roles.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </TableCellBody>
      <TableCellBody>
        <Button loading={loading} onClick={handleRemoveUser}>
          Remove
        </Button>
        {type === TYPES.PENDING_MEMBERS && (
          <Button loading={loading} onClick={handleApproveUser}>
            Approve
          </Button>
        )}
      </TableCellBody>
    </TableRowBody>
  )
}

export default memo(ListItem)
