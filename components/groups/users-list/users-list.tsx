import React, { useEffect, useState, memo, useCallback } from 'react'

import Table, { TableCellHeader } from '@components/generic/table/table'
import EntitySearch from '@components/generic/entity-search/entity-search'
import { MemberType } from '@lib/types/entities/group'

import ListItem from './list-item'

export enum TYPES {
  MEMBERS = 'members',
  PENDING_MEMBERS = 'pendingMembers',
}

export enum METHODS {
  UPDATE = 'PUT',
  DELETE = 'DELETE',
}

interface Props {
  users: MemberType[]
  roles: Array<{ value: string | number; label: string }>
  onChange: (
    value: Array<MemberType> | MemberType | string,
    method?: METHODS
  ) => void
  type: TYPES
  loading?: boolean;
}

const headerCells = [
  <TableCellHeader key="user">User</TableCellHeader>,
  <TableCellHeader key="role">Role</TableCellHeader>,
  <TableCellHeader key="actions">Actions</TableCellHeader>,
]

const entityNameGetter = ({ username, email }) => `${username} | ${email}`

function UsersList({ users = [], onChange, roles = [], type, loading = false }: Props) {
  const [items, setItems] = useState(users)
  const [role] = roles

  useEffect(() => {
    setItems(users)
  }, [users])

  const addUser = useCallback(
    (user) => {
      const newItems = [
        ...items,
        {
          ...user,
          roles: [role.value],
        },
      ]

      setItems(newItems)

      onChange(newItems)
    },
    [setItems, onChange, role, items]
  )

  const removeUser = useCallback(
    (userId) => {
      const newItems = items.filter(({ id: itemId }) => itemId !== userId)

      setItems(newItems)

      if (type === TYPES.PENDING_MEMBERS) {
        onChange(userId, METHODS.DELETE)
      } else {
        onChange(newItems)
      }
    },
    [items, setItems, onChange, type]
  )

  const approveUser = useCallback(
    (user) => {
      onChange(user, METHODS.UPDATE)
    },
    [onChange]
  )

  const setUserRole = useCallback(
    (userId, role) => {
      const newItems = items.map((item) => {
        if (item.id !== userId) {
          return item
        }

        return {
          ...item,
          roles: [role],
        }
      })

      setItems(newItems)

      if (type === TYPES.MEMBERS) {
        onChange(newItems)
      }
    },
    [items, setItems, onChange, type]
  )

  return (
    <>
      <div className="user-permissions">
        {type === TYPES.MEMBERS && (
          <div className="user-permissions-top">
            <EntitySearch
              placeholder="Search users..."
              entity="user"
              onChange={addUser}
              entityName={entityNameGetter}
            />
          </div>
        )}
        <div className="user-list">
          <Table headerCells={headerCells}>
            {items.map((user) => (
              <ListItem
                loading={loading}
                key={user.id}
                user={user}
                removeUser={removeUser}
                roles={roles}
                setUserRole={setUserRole}
                approveUser={approveUser}
                type={type}
              />
            ))}
          </Table>
        </div>
      </div>
      <style jsx>{`
        .user-permissions-top {
          margin-bottom: var(--edge-gap);
        }

        .select-role {
          min-width: 200px;
        }
      `}</style>
    </>
  )
}

export default memo(UsersList)
