import { memo, useCallback } from 'react'

import ArrowUp from '@icons/arrow-up.svg'
import ArrowDown from '@icons/arrow-down.svg'

const svgStyles = {
  fill: 'var(--edge-foreground)',
  height: 12,
  weight: 12,
  cursor: 'pointer',
}

export type SortingValue = {
  sortBy: string
  sortOrder: string
}

type Props = {
  value: SortingValue
  onChange: (value: SortingValue) => void
  options: Array<{ label: string; value: string | number }>
}

const sortOrderMapping = {
  DESC: 'ASC',
  ASC: 'DESC',
}

function Sorting({ onChange, value, options }: Props) {
  const handleChangeSortBy = useCallback(
    (event) => {
      const sortBy = event.target.value

      onChange({ ...value, sortBy })
    },
    [value, onChange]
  )

  const { sortBy, sortOrder } = value

  const handleChangeSortOrder = useCallback(() => {
    onChange({ ...value, sortOrder: sortOrderMapping[sortOrder] })
  }, [value, onChange])

  return (
    <>
      <span className="sorting">
        <div className="sortBy">
          <select
            name="sortBy"
            className="sortBy"
            onChange={handleChangeSortBy}
            value={sortBy}
          >
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="sortOrder" onClick={handleChangeSortOrder}>
          {sortOrder === 'DESC' ? (
            <ArrowUp style={svgStyles} />
          ) : (
            <ArrowDown style={svgStyles} />
          )}
        </div>
      </span>
      <style jsx>
        {`
          .sorting {
            background: var(--edge-background);
            border-radius: 8px;
            padding: 8px;
            display: flex;
            align-items: center;
            display: flex;
            justify-content: flex-end;
            z-index: 1;
            position: relative;
            margin-bottom: 8px;
            box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
          }

          .sortBy {
            border: none;
            cursor: pointer;
            font-size: 12px;
            padding: 0;
          }

          .sortOrder {
            width: 25px;
            text-align: center;
            height: 25px;
            line-height: 25px;
          }

          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            text-indent: 1px;
            text-overflow: '';
          }

          select::-ms-expand {
            display: none;
          }
        `}
      </style>
    </>
  )
}

export default memo(Sorting)
