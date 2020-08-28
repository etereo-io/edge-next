import React, { memo, useMemo, useCallback, useState } from 'react'

import { INTERACTION_TYPES } from '@lib/constants'
import fetcher from '@lib/fetcher'
import API from '@lib/api/api-endpoints'
import Like from '@icons/like.svg'
import Favorite from '@icons/favorite.svg'
import Follow from '@icons/follow.svg'

import { InteractionItem } from '../types'

interface Props {
  item: InteractionItem
  entity: string
  entityType: string
}

const ICONS_MAPPING = {
  [INTERACTION_TYPES.LIKE]: Like,
  [INTERACTION_TYPES.FAVORITE]: Favorite,
  [INTERACTION_TYPES.FOLLOW]: Follow,
}

function getTitle(type: INTERACTION_TYPES, isActive: boolean) {
  switch (type) {
    case INTERACTION_TYPES.FAVORITE:
      return isActive ? 'Remove from favorites' : 'Add to favorites'
    case INTERACTION_TYPES.FOLLOW:
      return isActive ? 'Unfollow' : 'Follow'
    case INTERACTION_TYPES.LIKE:
      return isActive ? 'Unlike' : 'Like'
  }
}

function Item({
  item: { type, canCreate, canRemove, interaction: defaultInteraction },
  entity,
  entityType,
}: Props) {
  const Icon = ICONS_MAPPING[type]
  const [interaction, setInteraction] = useState(defaultInteraction)
  const [isActive, setIsActive] = useState(!!interaction)

  const title = getTitle(type, isActive)

  const handleCreation = useCallback(() => {
    if (canCreate) {
      fetcher(`${API.interactions}/${entity}/${entityType}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity, entityType, type }),
      }).then(
        (result) => {
          setIsActive(true)
          setInteraction(result)
        },
        //TODO: handle somehow
        (err) => console.log('Something went wrong')
      )
    }
  }, [canCreate, setIsActive, type, setInteraction])

  const handleRemoving = useCallback(() => {
    if (canRemove && isActive) {
      const { entity, entityType, id, type } = interaction

      fetcher(`${API.interactions}/${entity}/${entityType}/${type}?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then(
        () => setIsActive(false),
        //TODO: handle somehow
        (err) => console.log('Something went wrong')
      )
    }
  }, [canRemove, interaction, isActive, setIsActive])

  const disabled = useMemo(() => {
    if (isActive && !canRemove) {
      return true
    }

    if (!canCreate && !isActive) {
      return true
    }

    return false
  }, [isActive, canRemove, canCreate])

  return (
    <>
      <button
        title={title}
        className={`interaction ${type} ${isActive ? 'active' : ''} ${
          disabled ? 'disabled' : ''
        }`}
        onClick={isActive ? handleRemoving : handleCreation}
        disabled={disabled}
      >
        <Icon />
      </button>

      <style jsx>
        {`
          .interaction {
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 20px;
            border: none;
            outline: none;
            display: inline-flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            background-color: rgb(239, 239, 239);
            margin-right: 5px;
          }
          .interaction:hover {
            background-color: #f6c6ce;
          }
          .interaction.active:hover {
            background-color: rgb(239, 239, 239);
          }

          .interaction.active {
            background-color: #f6c6ce;
          }

          .interaction svg {
            fill: #000000;
          }
          .interaction:hover svg {
            fill: #ff0000;
          }

          .interaction.active svg {
            fill: #ff0000;
          }
          .interaction.active:hover svg {
            fill: #000000;
          }

          .interaction.disabled {
            cursor: default;
          }
        `}
      </style>
    </>
  )
}

export default memo(Item)
