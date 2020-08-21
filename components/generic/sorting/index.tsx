import { memo, useCallback } from 'react'

import ArrowUp from 'public/icons/arrow-up.svg'
import ArrowDown from 'public/icons/arrow-down.svg'

const svgStyles = {
  fill: 'var(--edge-foreground)',
  height: 20,
  weight: 20,
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
        <div className="vl" />
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
            display: flex;
            justify-content: flex-end;
          }

          .vl {
            border-left: 2px solid var(--light-border-color);
          }

          .sortBy {
            width: 200px;
            border: none;
          }

          .sortOrder {
            width: 50px;
            align-self: center;
            text-align: center;
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
