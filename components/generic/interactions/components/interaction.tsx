import React, { memo, useCallback, useMemo, useState } from 'react'

import StackedAvatars from '@components/generic/stacked-avatars'
import { InteractionTypeDefinition, UserType } from '@lib/types'
import fetcher from '@lib/fetcher'
import { useUser } from '@lib/client/hooks'

import Item from './item'
import { InteractionEntity, InteractionItem } from '../types'
import useInteractionPermissions from '../hooks/useInteractionPermissions'

interface Props {
  interactions: InteractionEntity[]
  entity: 'group' | 'content' | 'user'
  entityType: string
  entityId: string
  interactionConfig: InteractionTypeDefinition
}

function Interaction({
  interactions,
  entity,
  entityType,
  entityId,
  interactionConfig,
}: Props) {
  const { user } = useUser()
  const { type } = interactionConfig
  const permissions = useInteractionPermissions(entity, entityType)

  const [isRemovedUser, setIsRemovedUser] = useState<boolean>(false)
  const [isNewUser, setIsNewUser] = useState<boolean>(false)
  const canSee = useMemo<boolean>(() => permissions[type].read, [
    type,
    permissions,
  ])
  const canCreate = useMemo<boolean>(() => permissions[type].create, [
    type,
    permissions,
  ])
  const canRemove = useMemo<boolean>(() => permissions[type].delete, [
    type,
    permissions,
  ])
  const interaction = useMemo(() => interactions && interactions[type], [
    interactions,
    type,
  ])

  const permittedUsers = useMemo<UserType[]>(() => {
    const users =
      interaction &&
      Array.isArray(interaction.result) &&
      interaction.result.map(({ user }) => user).filter(Boolean)

    if (canSee && Array.isArray(users)) {
      return users
    }

    return []
  }, [canSee, interaction])

  const users = useMemo<UserType[]>(() => {
    if (!permittedUsers.length && isNewUser) {
      return [user]
    }

    let usersList = permittedUsers

    if (isRemovedUser) {
      usersList = permittedUsers.filter(({ id }) => id !== user.id)
    }

    if (isNewUser && !usersList.some(({ id }) => id === user.id)) {
      usersList = [...permittedUsers, user]
    }

    return usersList
  }, [permittedUsers, isNewUser, isRemovedUser, user])

  const item = useMemo<InteractionItem | undefined>(() => {
    const isNumber = interaction && typeof interaction.result === 'number'
    const count = isNumber && interaction.result

    if (canSee || !!interaction) {
      return {
        type,
        canCreate,
        canRemove,
        interaction: interaction.interaction,
        count,
        isNumber,
        config: interactionConfig,
      }
    }

    return undefined
  }, [canSee, canRemove, canRemove, interaction, interactionConfig])

  const handleCreation = useCallback(
    (url, body, isNumber) =>
      fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((result) => {
        if (!isNumber) {
          setIsNewUser(true)
          setIsRemovedUser(false)
        }

        return result
      }),
    [setIsNewUser, setIsRemovedUser]
  )

  const handleRemoving = useCallback(
    (url, isNumber) =>
      fetcher(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then((result) => {
        if (!isNumber) {
          setIsNewUser(false)
          setIsRemovedUser(true)
        }

        return result
      }),

    [setIsNewUser, setIsRemovedUser]
  )

  return (
    <>
      <StackedAvatars width="40px" maxItems={3} users={users.filter(Boolean)} />
      <Item
        item={item}
        entityId={entityId}
        entity={entity}
        entityType={entityType}
        create={handleCreation}
        remove={handleRemoving}
      />
    </>
  )
}

export default memo(Interaction)
