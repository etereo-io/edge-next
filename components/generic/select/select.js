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
          color: var(--empz-foreground);
          background: var(--empz-background);
        }

        .select-prefix {
          display: inline-flex;
          position: absolute;
          pointer-events: none;
          width: var(--empz-gap);´
          height: var(--empz-gap);
          left: 10px;
        }

        .prefix {

        }
        select {
          padding: 5px var(--empz-gap);
          padding-left: var(--empz-gap-double);
          border: var(--light-border);
          color: var(--empz-foreground);
          background: var(--empz-background);
        }

        .no-prefixes select {
          padding-left: var(--empz-gap);
        }
      `
      }</style>
    </>
  )
}