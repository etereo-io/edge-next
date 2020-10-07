import React, { memo } from 'react'

import { ArrowIcon } from '@components/statistic'
import { SingleStatisticElement } from '@lib/types'
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
    <div className={`stats-unit ${increasing < 0 ? 'minus' : ''}`}>
      <div className="stats-unit-view">
        <small className="stats-unit-percentage">
          {increasing !== 0 && <ArrowIcon isError={increasing < 0} />}
          {increasing === 0 && <div className="equal">=</div>}
        </small>
        <div className="stats-title">
          <b className="stats-unit-data">{total}</b>
          <h4 className="stats-unit-title">Total {title}</h4>
        </div>
      </div>
      <b className="stats-unit-increase">{formatter(increasing)}</b>
    </div>
    <style jsx>
      {
        `
        .stats-unit {
          align-items: center;
          background: var(--edge-background);
          border-radius: 8px;
          box-shadow: var(--shadow-smallest);
          display: flex;
          justify-content: space-between;
          padding: 24px;
          position: relative;
          transition: box-shadow 0.35s ease-in, transform 0.35s ease-in;
          margin: var(--edge-gap);
          flex: 1;
        }

        .stats-unit-view {
          align-items: center;
          display: flex;
        }

        @media all and (max-width: 600px) {
          .stats-unit  {
            margin-bottom: 16px;
            width: calc(50% - 16px);
          }
        }

         .stats-unit:hover {
          box-shadow: var(--shadow-hover);
          transform: scale(1.025);
        }

        .stats-unit-data {
          display: block;
          font-size: 23px;
        }

        .stats-unit-title {
          color: var(--accents-4);
          display: block;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
        }

        .stats-unit-percentage {
          align-items: center;
          background: var(--edge-success-soft);
          border-radius: 8px;
          display: flex;
          font-size: 14px;
          font-weight: 600;
          padding: 0;
          margin-right: 8px;
          justify-content: center;
          height: 48px;
          width: 48px;
        }

        @media all and (max-width: 990px) {
          .stats-unit-percentage  {
            height: 36px;
            width: 36px;
          }
        }

        @media all and (max-width: 960px) {
          .stats-unit {
            padding: 16px;
          }
          .stats-unit-increase {
            font-size: 12px;
            position: absolute;
            top: 4px;
            right: 8px;
          }
        }

        @media all and (min-width: 600px) and (max-width: 760px) {
          .stats-unit-percentage  {
            height: 24px;
            width: 24px;
          }

          .stats-unit-data {
            font-size: 21px;
          }

          .stats-unit-title {
            font-size: 12px;
          }
        }

        .stats-unit-increase {
          color: var(--edge-success);
        }

        .stats-unit.minus .stats-unit-percentage {
          background: var(--edge-error-soft);
        }

        .stats-unit.minus .stats-unit-increase {
          color: var(--edge-error);
        }
        
        `
      }
    </style>
    </>
  )
}

export default memo(Widget)
