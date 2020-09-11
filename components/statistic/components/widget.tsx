import React, { memo } from 'react'

import { SingleStatisticElement } from '@lib/types'
import { ArrowIcon } from '@components/statistic'
import formatter from '@components/statistic/utils/formatter'

interface Props {
  data: SingleStatisticElement
}

function Widget({
  data: { title, total, todayTotal = 0, yesterdayTotal = 0 },
}: Props) {
  const increasing = todayTotal - yesterdayTotal

  return (
    <>
      <div className="stats-unit-view">
        <small className="stats-unit-percentage">
          {increasing !== 0 && <ArrowIcon isError={increasing < 0} />}
        </small>
        <div className="stats-title">
          <b className="stats-unit-data">{total}</b>
          <h4 className="stats-unit-title">Total {title}</h4>
        </div>
      </div>
      <b className="stats-unit-increase">{formatter(increasing)}</b>
    </>
  )
}

export default memo(Widget)
