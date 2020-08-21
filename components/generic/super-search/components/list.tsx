import { memo } from 'react'

import { Data } from '../types'

interface Props {
  data: Data
}

function List({ data }: Props) {
  return (
    <>
      <div className="list">
        List of itemsList of itemsList of itemsList of itemsList of items
        itemsList of itemsList of itemsList of itemsList of itemsList of
        itemsList of itemsList of itemsList of itemsList of itemsList of
        itemsList of itemsList of itemsList of itemsList of itemsList of
        itemsList of itemsList of itemsList of itemsList of itemsList of
        itemsList of itemsList of itemsList of itemsList of itemsList of
        itemsList of itemsList of itemsList of itemsList of itemsList of
        itemsList of itemsList of items
      </div>
      <style jsx>{`
        .list {
          position: fixed;
          width: 500px;
          z-index: 99;
          background: var(--edge-background);
        }
      `}</style>
    </>
  )
}

export default memo(List)
