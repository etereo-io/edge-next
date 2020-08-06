import React, {memo} from 'react'

import Placeholder from '@components/generic/loading/loading-placeholder/loading-placeholder'

function LoadingItems() {
  return (
    <>
      <div className="placeholders">
        <div className="p">
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
        </div>
        <div className="p">
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
          <div className="r">
            <Placeholder width={'100%'} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .p {
          background: var(--edge-background);
          padding: var(--edge-gap);
          margin-bottom: var(--edge-gap);
          border-radius: var(--edge-radius);
        }
        .r {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default memo(LoadingItems)