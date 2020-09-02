import React, { memo, useMemo, useCallback, useState } from 'react'

import API from '@lib/api/api-endpoints'
import ReactionCounter from '@components/generic/reaction-counter/reaction-counter'

import { InteractionItem, InteractionTypeDefinition } from '../types'

interface Props {
  item: InteractionItem
  entity: string
  entityType: string
  entityId: string
  create: (
    url: string,
    body: object,
    isNumber: boolean,
    type: string
  ) => Promise<any>
  remove: (url: string, isNumber: boolean, type: string) => Promise<any>
}

function getTitle(
  isActive: boolean,
  { inactiveTitle, activeTitle }: InteractionTypeDefinition
) {
  if (isActive && activeTitle) {
    return activeTitle
  }

  if (!isActive && inactiveTitle) {
    return inactiveTitle
  }

  return ''
}

function Item({
  item: {
    type,
    canCreate,
    canRemove,
    interaction: defaultInteraction,
    count,
    isNumber,
    config,
  },
  entity,
  entityType,
  entityId,
  create,
  remove,
}: Props) {
  const [interaction, setInteraction] = useState(defaultInteraction)
  const [isActive, setIsActive] = useState<boolean>(!!interaction)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(count)
  const title = getTitle(isActive, config)

  const handleCreation = useCallback(() => {
    if (canCreate) {
      setLoading(true)

      create(
        `${API.interactions}/${entity}/${entityType}/${type}`,
        {
          entity,
          entityType,
          type,
          entityId,
        },
        isNumber,
        type
      )
        .then(
          (result) => {
            setIsActive(true)
            setInteraction(result)

            if (isNumber) {
              setCounter((prevState) => +prevState + 1)
            }
          },
          //TODO: handle somehow
          (err) => console.log('Something went wrong')
        )
        .finally(() => setLoading(false))
    }
  }, [
    canCreate,
    setIsActive,
    type,
    setInteraction,
    entityId,
    setCounter,
    isNumber,
  ])

  const handleRemoving = useCallback(() => {
    if (canRemove && isActive) {
      const { entity, entityType, id, type } = interaction

      setLoading(true)

      remove(
        `${API.interactions}/${entity}/${entityType}/${type}?id=${id}`,
        isNumber,
        type
      )
        .then(
          () => {
            setIsActive(false)

            if (isNumber) {
              setCounter((prevState) => prevState - 1)
            }
          },
          //TODO: handle somehow
          (err) => console.log('Something went wrong')
        )
        .finally(() => setLoading(false))
    }
  }, [canRemove, interaction, isActive, setIsActive, isNumber])

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
      <div className="interaction-block">
        <ReactionCounter
          isLoading={isLoading}
          active={isActive}
          count={counter}
          onClick={isActive ? handleRemoving : handleCreation}
          disabled={disabled}
          type={type}
          title={title}
        />
      </div>
    </>
  )
}

export default memo(Item)
