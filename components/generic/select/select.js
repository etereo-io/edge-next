import { useState } from 'react'

export default function(props) {
  const { name, children, prefixes = [] } = props

  const [selectedValue, setSelectedValue] = useState(props.value)

  let selectedPrefix 
  
  if (prefixes.length > 0) {
    selectedPrefix = prefixes.find(p => p.value === selectedValue)
    if (!selectedPrefix) {
      selectedPrefix = prefixes[0].prefix
    } else {
      selectedPrefix = selectedPrefix.prefix
    }
  }

  const onChange = (ev) => {
    setSelectedValue(ev.target.value)
    if(props.onChange) {
      props.onChange(ev)
    }
  }

  return (
    <>
      <div className={`select-wrapper ${prefixes.length === 0 ? 'no-prefixes': ''}`}>
        <div className="select-prefix">
          { selectedPrefix }
        </div>
        <select name={name} value={selectedValue} onChange={onChange}>
          {children}
        </select>
        <div className="select-sufix">

        </div>
      </div>
      <style jsx>{`
        .select-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--themed-fg);
        }

        .select-prefix {
          display: inline-flex;
          position: absolute;
          pointer-events: none;
          width: 15px;´
          height: 15px;
          left: 10px;
        }

        .prefix {

        }
        select {
          padding: 5px 15px;
          padding-left: 30px;
        }

        .no-prefixes select {
          padding-left: 15px;
        }
      `
      }</style>
    </>
  )
}