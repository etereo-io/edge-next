import { useState, useEffect, memo } from 'react'

function Select(props) {
  const { name, children, prefixes = [] } = props

  const [selectedValue, setSelectedValue] = useState(props.value)

  let selectedPrefix

  if (prefixes.length > 0) {
    selectedPrefix = prefixes.find((p) => p.value === selectedValue)
    if (!selectedPrefix) {
      selectedPrefix = prefixes[0].prefix
    } else {
      selectedPrefix = selectedPrefix.prefix
    }
  }

  const onChange = (ev) => {
    setSelectedValue(ev.target.value)
    if (props.onChange) {
      props.onChange(ev)
    }
  }

  useEffect(() => {
    setSelectedValue(props.value)
  }, [props.value])

  return (
    <>
      <div
        className={`select-wrapper ${
          prefixes.length === 0 ? 'no-prefixes' : ''
        }`}
      >
        <div className="select-prefix">{selectedPrefix}</div>
        <select name={name} value={selectedValue} onChange={onChange}>
          {children}
        </select>
        <div className="select-sufix"></div>
      </div>
      <style jsx>{`
        .select-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--edge-foreground);
          background: var(--edge-background);
        }

        .select-prefix {
          display: inline-flex;
          position: absolute;
          pointer-events: none;
          width: var(--edge-gap);´
          height: var(--edge-gap);
          left: 10px;
        }

        .no-prefixes select {
          padding-left: var(--edge-gap-double);
        }

        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          -ms-appearance: none;
          appearance: none;
          outline: 0;
          box-shadow: none;
          border: 0 !important;
          background: var(--accents-2);
          background-image: none;
          color: var(--accents-5);
          font-size: 12px;
          flex: 1;
          padding: var(--edge-gap-half) var(--edge-gap-half) var(--edge-gap-half) var(--edge-gap-double);
          cursor: pointer;
        }
        
        select::-ms-expand {
          display: none;
        }
        
        .select-wrapper {
          position: relative;
          display: flex;
          overflow: hidden;
          border-radius: var(--edge-radius);
        }
        
        .select-wrapper.no-prefixes::after {
          border-bottom: 2px solid var(--accents-5);
          border-right: 2px solid var(--accents-5);
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          left: 16px;
          height: 8px;
          background: transparent;
          cursor: pointer;
          pointer-events: none;
          transition: .25s ease;
          width: 8px;
        }
        
        .select-wrapper:hover:after {
          transform: translateY(-50%) rotate(225deg);
        }
      `}</style>
    </>
  )
}

export default memo(Select)
