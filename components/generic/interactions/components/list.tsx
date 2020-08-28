import React, { memo, useMemo } from 'react'

import { InteractionEntity, InteractionItem } from '../types'
import useInteractionPermissions from '../hooks/useInteractionPermissions'
import Item from './item'

interface Props {
  interactions: InteractionEntity[]
  entity: string
  entityType: string
}

function List({ interactions, entity, entityType }: Props) {
  const permissions = useInteractionPermissions(entity, entityType)

  const items: InteractionItem[] = useMemo(
    () =>
      Object.entries(permissions).reduce(
        (
          acc,
          [type, { read: canSee, create: canCreate, delete: canRemove }]
        ) => {
          const interaction =
            interactions && interactions[type] && interactions[type].interaction

          if (canSee || !!interaction) {
            acc.push({
              type,
              canCreate,
              canRemove,
              interaction,
            })
          }

          return acc
        },
        []
      ),
    [interactions, permissions]
  )

  return (
    <>
      {items.map((item) => (
        <Item
          key={item.type}
          item={item}
          entity={entity}
          entityType={entityType}
        />
      ))}
    </>
  )
}

export default memo(List)
