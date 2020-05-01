import { useState, useEffect } from 'react'


export default function toggle({value = false, onChange = () => {}}) {
  const [enabled, setEnabled] = useState(!!value)

  useEffect(() => {
    setEnabled(!!value)
  }, [value])

  const onToggle = () => {
    setEnabled(!enabled)
    onChange(!enabled)
  }
  
  return (
    <>
      <div onClick={onToggle} className={`toggle ${enabled ? 'enabled': null }`}>
        <div className="toggle-ball"></div>
      </div>
      <style jsx>{`
        .toggle {
          cursor: pointer;
          border: var(--empz-light-border);
          border-radius: var(--empz-radius);
          background: var(--empz-foreground);
          position: relative;
          width: 70px;
          height: 24px;
          padding: 2px;
          transition: background 300ms linear;          
        }

        .toggle-ball {
          border-radius: 100%;
          border: 2px solid var(--empz-background);
          background: var(--empz-background);
          position: absolute;
          left: 0;
          height: 20px;
          width: 20px;
          transition: left 300ms linear;
        }

        .toggle.enabled {
          background: var(--empz-secondary);
        }

        .toggle.enabled .toggle-ball {
          left: 50px;
        }

      `}</style>
    </>
  )
}