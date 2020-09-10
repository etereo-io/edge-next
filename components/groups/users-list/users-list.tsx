import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'

import EntitySearch from '@components/generic/entity-search/entity-search'
import { MemberType } from '@lib/types/entities/group'
import {
  ExtendedColumn,
  Table as ReactTable,
} from '@components/generic/react-table'
import { UserType } from '@lib/types'
import Link from 'next/link'
import Button from '@components/generic/button/button'
import Avatar from '@components/user/avatar/avatar'

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
  loading?: boolean
}

const entityNameGetter = ({ username, email }) => `${username} | ${email}`

function UsersList({
  users = [],
  onChange,
  roles = [],
  type,
  loading = false,
}: Props) {
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
    (userId) => () => {
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
    (user) => () => {
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

  const handleChangeRole = useCallback(
    (id) => (event) => {
      setUserRole(id, event.target.value)
    },
    [setUserRole]
  )

  const columns = useMemo<
    ExtendedColumn<{ user: UserType; loading: boolean; type: TYPES }>[]
  >(
    () => [
      {
        Header: 'User',
        id: 'user',
        Cell: ({
          row: {
            original: {
              user: { id, username, email },
              user,
            },
          },
        }) => (
          <>
            <Avatar width={'32px'} user={user} />
            <Link href={`/profile/${id}`}>{username || email}</Link>
          </>
        ),
      },
      {
        Header: 'Role',
        id: 'roles',
        Cell: ({
          row: {
            original: {
              user: { roles: userRoles, id },
              loading,
            },
          },
        }) => (
          <select
            className="select-role"
            value={userRoles ? userRoles[0] : undefined}
            onChange={handleChangeRole(id)}
            disabled={loading}
          >
            {roles.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ),
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({
          row: {
            original: { user, loading, type },
          },
        }) => (
          <>
            <Button loading={loading} onClick={removeUser(user.id)}>
              Remove
            </Button>
            {type === TYPES.PENDING_MEMBERS && (
              <Button loading={loading} onClick={approveUser(user)}>
                Approve
              </Button>
            )}
          </>
        ),
      },
    ],
    [approveUser, removeUser, handleChangeRole]
  )

  const data = useMemo(() => items.map((user) => ({ user, loading, type })), [
    items,
    loading,
    type,
  ])

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
          <ReactTable
            columns={columns as ExtendedColumn<object>[]}
            data={data}
            loading={loading}
          />
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
