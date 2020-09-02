import React, { memo, useCallback, useMemo, useState } from 'react'

import { InteractionEntity, InteractionItem } from '../types'
import useInteractionPermissions from '../hooks/useInteractionPermissions'
import Item from './item'
import StackedAvatars from '@components/generic/stacked-avatars'
import fetcher from '@lib/fetcher'
import { useUser } from '@lib/client/hooks'
import { UserType } from '@lib/types'
import { INTERACTION_TYPES } from '@lib/constants'

interface Props {
  interactions: InteractionEntity[]
  entity: string
  entityType: string
  entityId: string
}

type Users = { [key in INTERACTION_TYPES]: UserType[] }

function List({ interactions, entity, entityType, entityId }: Props) {
  const [isRemovedUser, setIsRemovedUser] = useState({})
  const [isNewUser, setIsNewUser] = useState({})
  const permissions = useInteractionPermissions(entity, entityType)
  const { user } = useUser()
  const permittedUsersByType = useMemo<Users>(
    () =>
      Object.entries(permissions).reduce((acc, [type, { read: canSee }]) => {
        const users =
          interactions &&
          interactions[type] &&
          Array.isArray(interactions[type].result) &&
          interactions[type].result.map(({ user }) => user).filter(Boolean)

        if (canSee && Array.isArray(users)) {
          acc[type] = users
        }

        return acc
      }, {} as Users),
    [permissions, interactions]
  )
  const items = useMemo<InteractionItem[]>(
    () =>
      Object.entries(permissions).reduce(
        (
          acc,
          [type, { read: canSee, create: canCreate, delete: canRemove }]
        ) => {
          const interaction =
            interactions && interactions[type] && interactions[type].interaction
          const isNumber =
            interactions &&
            interactions[type] &&
            typeof interactions[type].result === 'number'
          const count = isNumber && interactions[type].result

          if (canSee || !!interaction) {
            acc.push({
              type,
              canCreate,
              canRemove,
              interaction,
              count,
              isNumber,
            })
          }

          return acc
        },
        []
      ),
    [interactions, permissions]
  )

  const handleCreation = useCallback(
    (url, body, isNumber, type) =>
      fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((result) => {
        if (!isNumber) {
          setIsNewUser((prevState) => ({ ...prevState, [type]: true }))
          setIsRemovedUser((prevState) => ({ ...prevState, [type]: false }))
        }

        return result
      }),
    [setIsNewUser, setIsRemovedUser]
  )

  const handleRemoving = useCallback(
    (url, isNumber, type) =>
      fetcher(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then((result) => {
        if (!isNumber) {
          setIsNewUser((prevState) => ({ ...prevState, [type]: false }))
          setIsRemovedUser((prevState) => ({ ...prevState, [type]: true }))
        }

        return result
      }),

    [setIsNewUser, setIsRemovedUser]
  )

  const users = useMemo<Users>(() => {
    if (
      (!Object.keys(permittedUsersByType).length ||
        !Object.values(permittedUsersByType).some(
          (interactionUsers) => interactionUsers.length
        )) &&
      Object.keys(isNewUser).length
    ) {
      return Object.entries(isNewUser).reduce((acc, [type, isNew]) => {
        if (isNew) {
          acc[type] = [user]
        }

        return acc
      }, {} as Users)
    }

    return Object.entries(permittedUsersByType).reduce(
      (acc, [type, interactionUsers]) => {
        acc[type] = interactionUsers

        if (isRemovedUser[type]) {
          acc[type] = interactionUsers.filter(({ id }) => id !== user.id)
        }

        if (isNewUser[type] && !acc[type].some(({ id }) => id === user.id)) {
          acc[type] = [...interactionUsers, user]
        }

        return acc
      },
      {} as Users
    )
  }, [permittedUsersByType, isNewUser, isRemovedUser, user])

  return (
    <>
      {Object.entries(users).map(([type, users]) => (
        <StackedAvatars
          key={type}
          width='40px'
          users={users.filter(Boolean)}
          title={type}
        />
      ))}
      {!!Object.keys(users).length && <hr />}
      {items.map((item) => (
        <Item
          key={item.type}
          item={item}
          entityId={entityId}
          entity={entity}
          entityType={entityType}
          create={handleCreation}
          remove={handleRemoving}
        />
      ))}
    </>
  )
}

export default memo(List)
