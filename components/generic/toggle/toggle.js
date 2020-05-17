import { useState, useEffect } from 'react'

export default function toggle({
  value = false,
  onChange = () => {},
  ...props
}) {
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
      <div
        onClick={onToggle}
        className={`toggle ${enabled ? 'enabled' : null}`}
        data-testid={props['data-testid']}
      >
        <div className="toggle-ball"></div>
      </div>
      <style jsx>{`
        .toggle {
          cursor: pointer;
          border: var(--light-border);
          border-radius: 12px;
          background: var(--empz-foreground);
          position: relative;
          width: 56px;
          height: 24px;
          padding: 2px;
          transition: background 300ms linear;
        }

        .toggle-ball {
          border-radius: 100%;
          border: 2px solid var(--empz-background);
          background: var(--empz-background);
          position: absolute;
          top: 50%;
          transition: left 0.25s ease, transform 0.25s ease;
          transform: translateY(-50%) translateX(4px);
          left: 0;
          height: 16px;
          width: 16px;
          will-change: left, transform;
        }

        .toggle.enabled {
          background: var(--empz-success);
        }

        .toggle.enabled .toggle-ball {
          left: 100%;
          transform: translateY(-50%) translateX(calc(-100% - 4px));
        }
      `}</style>
    </>
  )
}
