import React, { memo } from 'react'
import Card from '@components/generic/card/card'
import GroupSummaryView from '@components/groups/read/group-summary-view/group-summary-view'

function Item({ item, type }) {
  return (
    <>
      <div className="list-item">
        <Card>
          <GroupSummaryView group={item} linkToDetail={true} type={type} />
        </Card>
      </div>
      <style jsx>{`
        .list-item {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default memo(Item)
